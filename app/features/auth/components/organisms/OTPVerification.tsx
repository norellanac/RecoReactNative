import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, TextInput } from '../../../../components/atoms';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

interface OTPVerificationProps {
  onOtpReceived: (otp: string) => void;
  onNext: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  onNext,
  onOtpReceived,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [errorMsg, setErrorMsg] = useState('');

  const validationSchema = Yup.object({
    otp: Yup.string()
      .matches(
        /^[a-zA-Z0-9]{6}$/,
        t(
          'passwordRecovery.OTPVerification.OtpError',
          'Invalid OTP format. It should be 6 alphanumeric characters.',
        ),
      )
      .required(
        t('passwordRecovery.OTPVerification.OtpRequired', 'OTP is required'),
      ),
  });

  const handleSubmit = async (values: { otp: string }) => {
    try {
      onOtpReceived(values.otp);
      onNext();
    } catch (error) {
      setErrorMsg(t('auth.OTPVerification.error'));
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headline" size="medium" color="info" style={styles.title}>
        {t('passwordRecovery.OTPVerification.title', 'Check your email')}
      </Text>
      <Text variant="body" size="medium" color="secondary" style={styles.body}>
        {t(
          'passwordRecovery.OTPVerification.body',
          'We have sent a verification code to your email. Please enter it below to continue.',
        )}
      </Text>
      <Formik
        initialValues={{ otp: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
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
              style={styles.input}
              placeholder={t(
                'passwordRecovery.OTPVerification.OtpPlaceHolder',
                'Enter your 6-digit code',
              )}
              onChangeText={handleChange('otp')}
              onBlur={handleBlur('otp')}
              value={values.otp}
              maxLength={6}
              keyboardType="default"
              autoCapitalize="none"
              textAlign="center"
            />
            {touched.otp && errors.otp ? (
              <Text style={styles.error}>{errors.otp}</Text>
            ) : errorMsg ? (
              <Text style={styles.error}>{errorMsg}</Text>
            ) : null}
            <Button
              variant="filled"
              title={t(
                'passwordRecovery.OTPVerification.verifyCode',
                'Verify Code',
              )}
              style={styles.button}
              onPress={handleSubmit as any}
              disabled={isSubmitting}
            />
            <Text style={styles.resendText}>
              {t(
                'passwordRecovery.OTPVerification.didNotReceive',
                'Did not receive the code?',
              )}{' '}
              <Text style={styles.resendLink}>
                {t('passwordRecovery.OTPVerification.resend', 'Resend Code')}
              </Text>
            </Text>
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
    marginTop: 80,
    backgroundColor: '#fff',
    //justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'left',
  },
  body: {
    marginBottom: 24,
    textAlign: 'left',
  },
  form: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
    width: '100%',
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
  },
  error: {
    color: 'red',
    marginTop: -16,
    marginBottom: 24,
    fontSize: 14,
    textAlign: 'center',
  },
  resendText: {
    color: '#666',
    marginTop: 20,
    fontSize: 15,
    textAlign: 'center',
  },
  resendLink: {
    color: '#7B61FF',
    textDecorationLine: 'underline',
  },
});

export default OTPVerification;
