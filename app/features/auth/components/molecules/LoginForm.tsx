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

  const handleLogin = async (values: LoginValues) => {
    try {
      const result = await login({
        email: values.email,
        password: values.password,
      }).unwrap();
      if (result.success) {
        const token = result.data.token;
        dispatch(
          loginSuccess({ user: result.data.user, token: token as string }),
        );
      } else {
        console.error('Login failed:', result.message);
      }
    } catch (err) {
      console.error('Failed to login:', err);
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
          // .min(6, t('Forms.password_long'))
          // .required(t('Forms.required')),
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
          />
          <Button
            variant="filled"
            title={t('login.login', 'Login')}
            onPress={() => handleSubmit()}
            isLoading={isLoading}
          />
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  form: {
    marginTop: 100,
    padding: 16,
  },
});
