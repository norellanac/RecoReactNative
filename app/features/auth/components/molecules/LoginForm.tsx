import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from '../../../../components/atoms';
import { useTranslation } from 'react-i18next';
import '../../../../helpers/i18n';
import '../../../../../polyfills';
import { Button } from '../../../../components/atoms';

export const LoginForm: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      onSubmit={(values) => console.log(values)}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email(t('Forms.invalid_email'))
          .required('Requerido'),
        password: Yup.string()
          .min(6, t('Forms.password_long'))
          .required('Requerido'),
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
            variant="rounded"
            label="Email"
            leftIcon="mail"
          />
          <TextInput
            placeholder="Password"
            onChangeText={handleChange('password')}
            onBlur={() => handleBlur('password')}
            value={values.password}
            errorMsg={errors.password}
            variant="rounded"
            label="Password"
            leftIcon="key"
          />
          <Button variant="elevated" title="Submit" onPress={handleSubmit} />
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  form: {
    padding: 16,
  },
});
