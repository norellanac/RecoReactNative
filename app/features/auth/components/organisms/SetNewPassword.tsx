import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Button, TextInput } from '../../../../components/atoms';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useUpdatePasswordMutation } from '../../../../services/authApi';

interface SetNewPasswordProps {
  otp: string;
  onSuccess: () => void;
}

const SetNewPassword: React.FC<SetNewPasswordProps> = ({ otp, onSuccess }) => {
  const { t } = useTranslation();
  const [updatePassword] = useUpdatePasswordMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .min(6, t('forms.commons.minLength', { min: 6 }))
      .required(t('forms.commons.required')),
    confirmPassword: Yup.string()
      .oneOf(
        [Yup.ref('newPassword'), null],
        t('forms.commons.passwordsMustMatch', 'Passwords must match'),
      )
      .required(t('forms.commons.required')),
  });

  const handleSubmit = async (
    values: { newPassword: string; confirmPassword: string },
    { setSubmitting }: any,
  ) => {
    try {
      await updatePassword({ otp, newPassword: values.newPassword }).unwrap();
      onSuccess();
    } catch (error) {
      setErrorMsg(t('auth.error.updating_password'));
    }
    setSubmitting(false);
  };

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return (
    <View style={styles.container}>
      <Text variant="headline" size="medium" color="info" style={styles.title}>
        {t('passwordRecovery.SetNewPass.title', 'Set a new password')}
      </Text>
      <Text variant="body" size="medium" color="secondary" style={styles.body}>
        {t(
          'passwordRecovery.SetNewPass.body',
          'Create a new password. Ensure it differs from previous ones for security.',
        )}
      </Text>
      <Formik
        initialValues={{ newPassword: '', confirmPassword: '' }}
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
              placeholder={t(
                'passwordRecovery.SetNewPass.placeholder1',
                'New Password',
              )}
              onChangeText={handleChange('newPassword')}
              onBlur={handleBlur('newPassword')}
              value={values.newPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              errorMsg={
                touched.newPassword && errors.newPassword
                  ? errors.newPassword
                  : undefined
              }
              endAdornment={
                <TouchableOpacity
                  onPress={togglePasswordVisibility}
                  style={styles.icon}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={22}
                    color="#888"
                  />
                </TouchableOpacity>
              }
              style={styles.input}
            />
            <TextInput
              variant="outlined"
              outlineColor="#c6c5c5"
              placeholder={t(
                'passwordRecovery.SetNewPass.placeholder2',
                'Confirm Password',
              )}
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              value={values.confirmPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              errorMsg={
                touched.confirmPassword && errors.confirmPassword
                  ? errors.confirmPassword
                  : undefined
              }
              endAdornment={
                <TouchableOpacity
                  onPress={togglePasswordVisibility}
                  style={styles.icon}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={22}
                    color="#888"
                  />
                </TouchableOpacity>
              }
              style={styles.input}
            />
            {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
            <Button
              variant="filled"
              style={styles.button}
              onPress={handleSubmit as any}
              loading={isSubmitting}
              title={t('passwordRecovery.SetNewPass.update', 'Update Password')}
            />
          </View>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 48,
    padding: 24,
    backgroundColor: '#fff',
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
    marginBottom: 12,
    width: '100%',
  },
  icon: {
    padding: 8,
  },
  button: {
    marginTop: 8,
    width: '100%',
  },
  error: {
    color: 'red',
    marginBottom: 8,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default SetNewPassword;
