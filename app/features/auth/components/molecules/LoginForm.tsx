import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
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

export const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // ✅ Función para mapear errores a mensajes amigables
  const getErrorMessage = (error: any): string => {
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
    Alert.alert(
      t('login.error', 'Error de inicio de sesión'),
      message,
      [
        {
          text: t('common.ok', 'Entendido'),
          style: 'default',
        },
      ],
      { cancelable: true },
    );
  };

  const handleLogin = async (values: LoginValues) => {
    console.log('Login values:', values);
    try {
      const cleanEmail = values.email.trim();
      const result = await login({
        email: cleanEmail,
        password: values.password,
      }).unwrap();

      console.log('Login result:', result);

      if (result.success) {
        const token = result.data.token;
        dispatch(
          loginSuccess({ user: result.data.user, token: token as string }),
        );
      } else {
        console.error('Login failed:', result.message);
        showErrorAlert(getErrorMessage(result));
      }
    } catch (err: any) {
      //console.error('Failed to login:', err);
      showErrorAlert(getErrorMessage(err));
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
      {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
        <View style={styles.form}>
          <TextInput
            placeholder={t('Forms.email', 'Email')}
            onChangeText={handleChange('email')}
            onBlur={() => handleBlur('email')}
            value={values.email}
            errorMsg={errors.email}
            variant="underlined"
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
