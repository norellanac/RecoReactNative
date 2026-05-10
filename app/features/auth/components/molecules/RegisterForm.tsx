import React from 'react';
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
import { useLoginMutation, useSignupMutation } from '@/app/services/authApi';
import { Icon } from '@/app/components/atoms/Icon';
import { useGlobalModal } from '@/app/hooks/useGlobalModal';
import { useBiometricAuth } from '@/app/hooks/useBiometricAuth';

export const RegisterForm: React.FC = () => {
  const { t } = useTranslation();
  const [onSignup, { isLoading: isSignupLoading }] = useSignupMutation();
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const { showModal } = useGlobalModal();
  const { isBiometricEnabled, enableBiometrics } = useBiometricAuth();
  const [showPassword, setShowPassword] = React.useState(false);

  const isLoading = isSignupLoading || isLoginLoading;

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // ✅ Función actualizada para mapear errores de registro - FIX PRINCIPAL
  const getSignupErrorMessage = (error: any): string => {
    const errorMessage =
      error?.data?.errors?.[0] || // ✅ Primer error del array errors
      error?.data?.message ||
      error?.message ||
      'Unknown error';

    //console.log('🔍 Mapping signup error message:', errorMessage);

    switch (errorMessage) {
      case 'email must be unique': // ✅ Error específico de tu backend
      case 'Email already exists':
      case 'User already exists':
        return t(
          'register.errors.emailExists',
          'Este correo ya está registrado. ¿Quieres iniciar sesión?',
        );
      case 'email must be a valid email':
      case 'Invalid email format':
        return t(
          'register.errors.invalidEmail',
          'El formato del correo electrónico no es válido',
        );
      case 'password is too weak':
      case 'Password too weak':
        return t(
          'register.errors.weakPassword',
          'La contraseña debe ser más segura. Incluye mayúsculas, números y símbolos',
        );
      case 'name is required':
      case 'name must not be empty':
        return t('register.errors.nameRequired', 'El nombre es obligatorio');
      case 'lastname is required':
      case 'lastname must not be empty':
        return t(
          'register.errors.lastnameRequired',
          'El apellido es obligatorio',
        );
      case 'password is required':
      case 'password must not be empty':
        return t(
          'register.errors.passwordRequired',
          'La contraseña es obligatoria',
        );
      case 'Registration temporarily disabled':
        return t(
          'register.errors.registrationDisabled',
          'El registro está temporalmente deshabilitado',
        );
      case 'Internal Server Error':
        return t(
          'register.errors.serverError',
          'Error del servidor. Intenta de nuevo más tarde',
        );
      default:
        return t(
          'register.errors.general',
          'Error al crear la cuenta. Verifica tus datos e intenta de nuevo',
        );
    }
  };

  // ✅ Función para mapear errores de login automático
  const getLoginErrorMessage = (error: any): string => {
    const errorMessage =
      error?.data?.message || error?.message || 'Unknown error';

    //console.log('🔍 Mapping login error message after signup:', errorMessage);

    switch (errorMessage) {
      case 'Account not activated':
        return t(
          'register.errors.accountNotActivated',
          'Cuenta creada exitosamente. Revisa tu correo para activarla',
        );
      case 'Account pending approval':
        return t(
          'register.errors.accountPending',
          'Cuenta creada. Está pendiente de aprobación',
        );
      default:
        return t(
          'register.errors.loginAfterSignup',
          'Cuenta creada pero hubo un error al iniciar sesión automáticamente',
        );
    }
  };

  // ✅ Función para mostrar alertas de error
  const showErrorAlert = (message: string, title?: string) => {
    showModal({
      title: title || t('register.error', 'Error de registro'),
      message,
    });
  };

  // ✅ Función para mostrar alertas de éxito
  const showSuccessAlert = (message: string) => {
    showModal({
      title: t('register.success', 'Registro exitoso'),
      message,
    });
  };

  const handleLogin = async (values: any) => {
    console.log('🔑 Attempting auto-login after signup...');

    try {
      const result = await login({
        email: values.email,
        password: values.password,
      }).unwrap();

      console.log('✅ Auto-login result:', JSON.stringify(result, null, 2));

      if (result.success) {
        const { accessToken, refreshToken, user } = result.data;

        showSuccessAlert(
          t(
            'register.welcomeMessage',
            'Bienvenido a Reco! Tu cuenta ha sido creada exitosamente',
          ),
        );

        dispatch(loginSuccess({ user, accessToken, refreshToken }));

        // Check for biometrics enrollment after success register (auto-login)
        const biometricsEnabled = await isBiometricEnabled();
        if (!biometricsEnabled) {
          setTimeout(() => {
            showModal({
              title: t('common.enable_biometrics', 'Enable Biometrics'),
              message: t(
                'common.biometrics_message',
                'Would you like to use biometrics for future logins?',
              ),
              onConfirm: async () => {
                setTimeout(async () => {
                  const success = await enableBiometrics(
                    values.email.trim(),
                    values.password,
                  );
                  if (success) {
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
        console.error('❌ Auto-login failed:', result.message);
        showErrorAlert(getLoginErrorMessage(result));
      }
    } catch (error: any) {
      console.error('❌ Auto-login error:', JSON.stringify(error, null, 2));
      showErrorAlert(getLoginErrorMessage(error));
    }
  };

  const handleSignup = async (values: any) => {
    console.log('📝 Starting signup process...');
    console.log('📝 Signup values:', JSON.stringify(values, null, 2));

    try {
      const signupResponse = await onSignup({
        name: values.name,
        lastname: values.lastname,
        email: values.email.trim(),
        password: values.password,
      }).unwrap();

      console.log(
        '✅ Signup response:',
        JSON.stringify(signupResponse, null, 2),
      );

      if (signupResponse.success) {
        console.log('✅ Signup successful, attempting auto-login...');
        await handleLogin(values);
      } else {
        console.error('❌ Signup failed:', signupResponse.message);
        console.error(
          '❌ Full signup response:',
          JSON.stringify(signupResponse, null, 2),
        );
        showErrorAlert(getSignupErrorMessage(signupResponse));
      }
    } catch (error: any) {
      // console.error('❌ Signup error (catch block):');
      // console.error('❌ Error object:', JSON.stringify(error, null, 2));
      // console.error('❌ Error.data:', JSON.stringify(error?.data, null, 2));
      // console.error('❌ Error.status:', error?.status);
      // console.error('❌ Error.message:', error?.message);

      showErrorAlert(getSignupErrorMessage(error));
    }
  };

  const handleSubmit = (values: {
    name: string;
    lastname: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    console.log(
      '🚀 Form submitted with values:',
      JSON.stringify(values, null, 2),
    );
    handleSignup(values);
  };

  return (
    <Formik
      initialValues={{
        name: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: '',
      }}
      onSubmit={handleSubmit}
      validationSchema={Yup.object().shape({
        name: Yup.string()
          .min(
            2,
            t('validations.min_length', 'Mínimo {{length}} caracteres', {
              length: 2,
            }),
          )
          .required(
            t('validations.required', 'This {{field}} is required', {
              field: t('auth.register.name', 'Name'),
            }),
          ),
        lastname: Yup.string()
          .min(
            2,
            t('validations.min_length', 'Mínimo {{length}} caracteres', {
              length: 2,
            }),
          )
          .required(
            t('validations.required', 'This {{field}} is required', {
              field: t('auth.register.lastname', 'Last Name'),
            }),
          ),
        email: Yup.string()
          .email(t('validations.invalid', 'Formato de correo inválido'))
          .required(
            t('validations.required', 'This {{field}} is required', {
              field: t('auth.register.email', 'Email'),
            }),
          ),
        password: Yup.string()
          .min(
            6,
            t('validations.min_length', 'Mínimo {{length}} caracteres', {
              length: 6,
            }),
          )
          .required(
            t('validations.required', 'This {{field}} is required', {
              field: t('Forms.password', 'Password'),
            }),
          ),
        confirmPassword: Yup.string()
          .oneOf(
            [Yup.ref('password')],
            t('validations.passwords_match', 'Las contraseñas deben coincidir'),
          )
          .required(
            t('validations.required', 'This {{field}} is required', {
              field: t('auth.register.confirm_password', 'Confirm Password'),
            }),
          ),
      })}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
        <View style={styles.form}>
          <TextInput
            placeholder={t('auth.register.name', 'Name')}
            onChangeText={handleChange('name')}
            onBlur={() => handleBlur('name')}
            value={values.name}
            errorMsg={errors.name}
            variant="underlined"
          />

          <TextInput
            placeholder={t('auth.register.lastname', 'Last Name')}
            onChangeText={handleChange('lastname')}
            onBlur={() => handleBlur('lastname')}
            value={values.lastname}
            errorMsg={errors.lastname}
            variant="underlined"
          />

          <TextInput
            placeholder={t('auth.register.email', 'Email')}
            onChangeText={handleChange('email')}
            onBlur={() => handleBlur('email')}
            value={values.email}
            errorMsg={errors.email}
            variant="underlined"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            placeholder={t('auth.register.password', 'Password')}
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
          />

          <TextInput
            placeholder={t(
              'auth.register.confirm_password',
              'Confirm Password',
            )}
            onChangeText={handleChange('confirmPassword')}
            onBlur={() => handleBlur('confirmPassword')}
            value={values.confirmPassword}
            errorMsg={errors.confirmPassword}
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
            title={t('register.sign_up', 'Sign Up')}
            onPress={() => handleSubmit()}
            isLoading={isLoading}
            style={{ marginTop: 32 }}
          />
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  form: {
    marginTop: 30,
    padding: 16,
  },
});
