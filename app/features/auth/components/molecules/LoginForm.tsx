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
import { useLoginMutation } from '@/app/services/api';
import { LoginValues } from '@/app/types/api/apiResponses';

export const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (values: LoginValues) => {
    console.error('values:', values);
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
        email: Yup.string().required(t('Forms.required')),
        password: Yup.string()
          .min(6, t('Forms.password_long'))
          .required(t('Forms.required')),
      })}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
        <View style={styles.form}>
          <TextInput
            placeholder={t('Forms.phone_number')}
            onChangeText={handleChange('email')}
            onBlur={() => handleBlur('email')}
            value={values.email}
            errorMsg={errors.email}
            variant="underlined"
            label={t('Forms.phone_number')}
          />
          <TextInput
            placeholder={t('Forms.password')} 
            onChangeText={handleChange('password')}
            onBlur={() => handleBlur('password')}
            value={values.password}
            errorMsg={errors.password}
            variant="underlined"
            label={t('Forms.password')}
            actionIcon="eye"
            especialIcon="-sharp"
          />
          <Button
            variant="filled"
            title={t('login.login')}
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