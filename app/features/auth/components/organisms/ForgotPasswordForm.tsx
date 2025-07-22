import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Button, TextInput } from '../../../../components/atoms';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useRequestPasswordResetMutation } from '../../../../services/authApi';
import PasswordRecoveryImage from '../../../../assets/img/PasswordRecovery.png';

interface ForgotPasswordFormProps {
  handleSecondScreen: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  handleSecondScreen,
}) => {
  const { t } = useTranslation();
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [requestPasswordReset, { isLoading }] =
    useRequestPasswordResetMutation();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t('forms.commons.email'))
      .required(t('forms.commons.required', 'Email required')),
  });

  const handlePasswordReset = async (values: { email: string }) => {
    try {
      await requestPasswordReset(values).unwrap();
      setSuccessMsg(t('passwordRecovery.success_message'));
      setErrorMsg('');
      handleSecondScreen();
    } catch (error) {
      setErrorMsg(t('passwordRecovery.error_message'));
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={PasswordRecoveryImage}
        style={styles.image}
        resizeMode="contain"
        accessibilityLabel="Ilustración de mujer con ícono de candado en mano"
      />
      <Text variant="headline" size="medium" color="info" style={styles.title}>
        {t('passwordRecovery.title1', 'Forgot Password?')}
      </Text>
      <Text variant="body" size="large" color="secondary" style={styles.body}>
        {t(
          'passwordRecovery.body1',
          'Please enter your email address to receive a password reset token.',
        )}
      </Text>
      <Formik
        initialValues={{ email: '' }}
        validationSchema={validationSchema}
        onSubmit={handlePasswordReset}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isSubmitting,
        }) => (
          <View style={styles.form}>
            <TextInput
              variant="outlined"
              outlineColor="#c6c5c5"
              autoComplete="email"
              autoFocus
              style={styles.input}
              placeholder={t('passwordRecovery.email_placeholder', 'Email')}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && touched.email && (
              <Text style={styles.error}>{errors.email}</Text>
            )}
            {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
            <Button
              title={t(
                'passwordRecovery.resetPasswordButton',
                'Reset Password',
              )}
              onPress={handleSubmit as any}
              style={{ marginTop: 8 }}
              variant="filled"
              disabled={isSubmitting || isLoading}
              loading={isLoading}
            />
            {successMsg ? (
              <Text style={styles.success}>{successMsg}</Text>
            ) : null}
          </View>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  body: {
    marginBottom: 24,
  },
  form: {
    width: '100%',
  },
  input: {
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  error: {
    color: 'red',
    marginBottom: 16,
    marginTop: -20,
  },
  success: {
    color: 'green',
    marginTop: 12,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ForgotPasswordForm;
