import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Input from '../atoms/TextInput';
import ErrorText from '../atoms/ErrorText';

import { useTranslation } from 'react-i18next';
import '../../helpers/i18n';
import '../../../polyfills';
import { Button } from '../atoms';

const FormField: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      // PARA MIENTRAS SOLO MANDO A LA CONSOLA LOS CAMPOS
      onSubmit={(values) => console.log(values)}
      validationSchema={Yup.object().shape({
        email: Yup.string().email('Email inválido').required('Requerido'),
        password: Yup.string()
          .min(6, t('Forms.passwordLong6'))
          .required('Requerido'),
      })}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <View style={styles.form}>
          <Input
            placeholder="Email"
            onChangeText={handleChange('email')}
            onBlur={() => handleBlur('email')}
            value={values.email}
          />
          {touched.email && errors.email && (
            <ErrorText>{errors.email}</ErrorText>
          )}
          <Input
            placeholder="Password"
            onChangeText={handleChange('password')}
            onBlur={() => handleBlur('password')}
            value={values.password}
            secureTextEntry
          />
          {touched.password && errors.password && (
            <ErrorText>{errors.password}</ErrorText>
          )}
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

export default FormField;
