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

export const RegisterForm: React.FC = () => {
  const { t } = useTranslation();
  const [onSignup] = useSignupMutation();
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();

  const handleLogin = async (values: SignupValues) => {
    try {
      const result = await login(values).unwrap();
      if (result.success) {
        const { token, user } = result.data;
        dispatch(loginSuccess({ user, token }));
      } else {
        console.error('Login failed:', result.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      // Handle the error appropriately, e.g., show a message to the user
      if (error.data) {
        console.error('Error data:', error.data);
      }
    }
  };

  const handleSignup = async (values: SignupValues) => {
    try {
      const signupResponse = await onSignup(values).unwrap();
      if (signupResponse.success) {
        handleLogin(values);
      }
    } catch (error) {
      console.error('Signup error:', error);
      // Handle the error appropriately, e.g., show a message to the user
      if (error.data) {
        console.error('Error data:', error.data);
      }
    }
  };

  const handleSubmit = (values: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    console.log(values);
    handleSignup(values);
  };

  return (
    <Formik
      initialValues={{
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
      }}
      onSubmit={handleSubmit}
      validationSchema={Yup.object().shape({
        fullName: Yup.string().required(
          t('validations.required', 'This {{field}} is required', {
            field: t('auth.register.full_name', 'Full Name'),
          }),
        ),
        email: Yup.string().required(
          t('validations.required', 'This {{field}} is required', {
            field: t('auth.register.email', 'Email'),
          }),
        ),
        password: Yup.string()
          .min(
            6,
            t(
              'validations.length',
              '{{field}} must be at least {{length}} characters',
              {
                field: t('Forms.password', 'Password'),
                length: 6,
              },
            ),
          )
          .required(
            t('validations.required', 'This {{field}} is required', {
              field: t('Forms.password', 'Password'),
            }),
          ),
        confirmPassword: Yup.string()
          .min(
            6,
            t(
              'validations.length',
              '{{field}} must be at least {{length}} characters',
              {
                field: t('Forms.password', 'Password'),
                length: 6,
              },
            ),
          )
          .required(
            t('validations.required', 'This {{field}} is required', {
              field: t('Forms.password', 'Password'),
            }),
          ),
      })}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
        <View style={styles.form}>
          <TextInput
            placeholder={t('auth.register.full_name', 'Full Name')}
            onChangeText={handleChange('fullName')}
            onBlur={() => handleBlur('fullName')}
            value={values.fullName}
            errorMsg={errors.fullName}
            variant="underlined"
          />

          <TextInput
            placeholder={t('auth.register.email', 'Email')}
            onChangeText={handleChange('email')}
            onBlur={() => handleBlur('email')}
            value={values.email}
            errorMsg={errors.email}
            variant="underlined"
          />

          <TextInput
            placeholder={t('auth.register.password', 'Password')}
            onChangeText={handleChange('password')}
            onBlur={() => handleBlur('password')}
            value={values.password}
            errorMsg={errors.password}
            variant="underlined"
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
          />
          <Button
            variant="filled"
            title={t('register.sign_up', 'Sign Up')}
            onPress={handleSubmit}
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
