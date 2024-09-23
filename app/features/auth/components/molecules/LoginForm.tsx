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

export const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleLogin = () => {
    const user = { id: '1', name: 'John Doe', email: 'john.doe@example.com' };
    dispatch(loginSuccess(user));
  };

  const handleSubmit = (values: { email: string; password: string }) => {
    console.log(values);
    handleLogin();
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
            placeholder="Email"
            onChangeText={handleChange('email')}
            onBlur={() => handleBlur('email')}
            value={values.email}
            errorMsg={errors.email}
            variant="underlined"
            label="Phone Number"
          />
          <TextInput
            placeholder="Password"
            onChangeText={handleChange('password')}
            onBlur={() => handleBlur('password')}
            value={values.password}
            errorMsg={errors.password}
            variant="underlined"
            label="Password"
            actionIcon="eye"
            especialIcon="-sharp"
          />
          <Button variant="filled" title="Log In" onPress={handleSubmit} />
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