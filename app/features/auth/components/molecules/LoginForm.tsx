import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from '../../../../components/atoms';
import { useTranslation } from 'react-i18next';
import '../../../../helpers/i18n';
import '../../../../../polyfills';
import { Button } from '../../../../components/atoms';
import { useAppDispatch } from '@/app/hooks/useAppDispatch';
import { loginSuccess } from '@/app/redux/slices/authSlice';
import { LoginValues } from '@/app/types/api/apiResponses';
import { useLoginMutation } from '@/app/services/authApi';
import { Icon } from '@/app/components/atoms/Icon';
import { BASE_URL } from '@/app/utils/Environment';
import { useBiometricAuth } from '@/app/hooks/useBiometricAuth';
import { useGlobalModal } from '@/app/hooks/useGlobalModal';

export const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const { showModal } = useGlobalModal();
  const {
    enableBiometrics,
    isBiometricEnabled,
    authenticateWithBiometrics,
    getBiometricIcon,
  } = useBiometricAuth();

  const [biometricsAvailable, setBiometricsAvailable] = useState(false);
  const [bioInfo, setBioInfo] = useState<{
    name: string;
    family: any;
    label: string;
  }>({
    name: 'fingerprint',
    family: 'MaterialIcons',
    label: 'Touch ID',
  });

  React.useEffect(() => {
    const checkBiometrics = async () => {
      const isEnabled = await isBiometricEnabled();
      setBiometricsAvailable(isEnabled);
      if (isEnabled) {
        const info = await getBiometricIcon();
        setBioInfo(info);
      }
    };
    checkBiometrics();
  }, [isBiometricEnabled]);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // ✅ Función para mapear errores a mensajes amigables
  const getErrorMessage = (error: any): string => {
    const status = error?.status;
    const originalStatus = error?.originalStatus;
    const httpStatus =
      originalStatus || (typeof status === 'number' ? status : null);

    if (status === 'FETCH_ERROR') {
      return t(
        'login.errors.networkError',
        `Error de conexión. No se pudo conectar al servidor (${BASE_URL}). Verifica tu conexión a internet.`,
      );
    }

    if (status === 'TIMEOUT_ERROR') {
      return t(
        'login.errors.timeout',
        'La solicitud tardó demasiado. Intenta de nuevo.',
      );
    }

    if (status === 'PARSING_ERROR') {
      if (httpStatus === 404) {
        return t(
          'login.errors.serviceUnavailable',
          'Servicio no disponible. Intenta de nuevo más tarde.',
        );
      }
      return t(
        'login.errors.serverError',
        `Error del servidor (${httpStatus || 'desconocido'}). Intenta más tarde.`,
      );
    }

    if (httpStatus && httpStatus >= 500) {
      return t(
        'login.errors.serverError',
        `Error del servidor (${httpStatus}). Intenta más tarde.`,
      );
    }

    if (httpStatus === 404) {
      return t(
        'login.errors.serviceUnavailable',
        'Servicio no disponible. Intenta de nuevo más tarde.',
      );
    }

    const errorMessage =
      error?.data?.message || error?.message || 'Unknown error';

    switch (errorMessage) {
      case 'User not found':
        return t(
          'login.errors.userNotFound',
          'No encontramos una cuenta con este correo electrónico',
        );
      case 'Invalid credentials':
      case 'Invalid password':
        return t(
          'login.errors.invalidCredentials',
          'La contraseña es incorrecta',
        );
      case 'Account is disabled':
        return t(
          'login.errors.accountDisabled',
          'Tu cuenta ha sido deshabilitada',
        );
      case 'Too many attempts':
        return t(
          'login.errors.tooManyAttempts',
          'Demasiados intentos. Intenta de nuevo más tarde',
        );
      default:
        return t(
          'login.errors.general',
          'Error al iniciar sesión. Verifica tus datos e intenta de nuevo',
        );
    }
  };

  // ✅ Función para mostrar alertas amigables
  const showErrorAlert = (message: string) => {
    showModal({
      title: t('login.error', 'Error de inicio de sesión'),
      message,
    });
  };

  const handleLogin = async (values: LoginValues, setFieldValue?: any) => {
    console.log('Login values:', values);
    try {
      const cleanEmail = values.email.trim();
      const result = await login({
        email: cleanEmail,
        password: values.password,
      }).unwrap();

      console.log('Login result:', result);

      if (result.success) {
        const { accessToken, refreshToken, user } = result.data;

        // Dispatch login first to ensure state is updated
        dispatch(loginSuccess({ user, accessToken, refreshToken }));

        // Check for biometrics enrollment after success login
        const biometricsEnabled = await isBiometricEnabled();
        if (!biometricsEnabled) {
          // Wrap in setTimeout to ensure it's not dismissed by navigation or previous UI
          setTimeout(() => {
            showModal({
              title: t('common.enable_biometrics', 'Enable Biometrics'),
              message: t(
                'common.biometrics_message',
                'Would you like to use biometrics for future logins?',
              ),
              onConfirm: async () => {
                // Small delay to allow previous modal to close before starting biometrics
                setTimeout(async () => {
                  const success = await enableBiometrics(
                    cleanEmail,
                    values.password,
                  );
                  if (success) {
                    // Success modal
                    setTimeout(() => {
                      showModal({
                        title: t('common.success', 'Success'),
                        message: t(
                          'common.biometrics_enabled',
                          'Biometrics enabled successfully',
                        ),
                      });
                    }, 500);
                  }
                }, 300);
              },
              showCancelButton: true,
              confirmButtonText: t('common.yes', 'Yes'),
            });
          }, 800);
        }
      } else {
        console.error('Login failed:', JSON.stringify(result, null, 2));
        showErrorAlert(getErrorMessage(result));
      }
    } catch (err: any) {
      console.error('Login error:', JSON.stringify(err, null, 2));
      showErrorAlert(getErrorMessage(err));
    }
  };

  const handleBiometricLogin = async (setFieldValue: any) => {
    const credentials = await authenticateWithBiometrics();
    if (credentials) {
      setFieldValue('email', credentials.email);
      setFieldValue('password', credentials.password);
      handleLogin(credentials, setFieldValue);
    }
  };

  const handleSubmit = (values: { email: string; password: string }) => {
    handleLogin(values);
  };

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      onSubmit={handleSubmit}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .required(
            t('validations.required', 'This {{field}} is required', {
              field: t('Forms.email', 'Email'),
            }),
          )
          .email(
            t('validations.invalid', 'Invalid {{field}}', {
              field: t('Forms.email', 'Email'),
            }),
          ),
        password: Yup.string()
          .required(
            t('validations.required', 'This {{field}} is required', {
              field: t('Forms.password', 'Password'),
            }),
          )
          .min(
            6,
            t('validations.min_length', 'Minimum {{length}} characters', {
              length: 6,
            }),
          ),
      })}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        setFieldValue,
      }) => (
        <View style={styles.form}>
          <TextInput
            placeholder={t('Forms.email', 'Email')}
            onChangeText={handleChange('email')}
            onBlur={() => handleBlur('email')}
            value={values.email}
            errorMsg={errors.email}
            variant="underlined"
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
          />
          <TextInput
            placeholder={t('Forms.password', 'Password')}
            onChangeText={handleChange('password')}
            onBlur={() => handleBlur('password')}
            value={values.password}
            errorMsg={errors.password}
            variant="underlined"
            secureTextEntry={!showPassword}
            endAdornment={
              <Icon
                name={showPassword ? 'eye-off' : 'eye'}
                onPress={handleShowPassword}
              />
            }
            onSubmitEditing={() => handleSubmit()}
          />
          <Button
            variant="filled"
            title={t('login.login', 'Login')}
            onPress={() => handleSubmit()}
            isLoading={isLoading}
            style={{ marginTop: 32 }}
          />
          {biometricsAvailable && (
            <Button
              variant="outlined"
              title={t('login.biometric_login', `Login with ${bioInfo.label}`)}
              onPress={() => handleBiometricLogin(setFieldValue)}
              style={{ marginTop: 16 }}
              startIcon={
                <Icon
                  name={bioInfo.name}
                  family={bioInfo.family}
                  size={24}
                  color="primary"
                />
              }
            />
          )}
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  form: {
    marginTop: 60,
    padding: 16,
  },
});
