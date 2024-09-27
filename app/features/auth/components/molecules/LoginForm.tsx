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
    const user = { id: '1', name: 'John Doe', phoneNumber: '12341234' };
    dispatch(loginSuccess(user));
  };

  const handleSubmit = (values: { phoneNumber: string; password: string }) => {
    handleLogin();
  };

  return (
    <Formik
      initialValues={{ phoneNumber: '', password: '' }}
      onSubmit={handleSubmit}
      validationSchema={Yup.object().shape({
        phoneNumber: Yup.string().required(t('Forms.required')),
        password: Yup.string()
          .min(6, t('Forms.password_long'))
          .required(t('Forms.required')),
      })}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
        <View style={styles.form}>
          <TextInput
            placeholder={t('Forms.phone_number')}
            onChangeText={handleChange('phoneNumber')}
            onBlur={() => handleBlur('phoneNumber')}
            value={values.phoneNumber}
            errorMsg={errors.phoneNumber}
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
          <Button variant="filled" title={t('login.login')} onPress={handleSubmit} />
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