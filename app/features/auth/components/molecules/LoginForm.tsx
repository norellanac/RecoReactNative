import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from '../../../../components/atoms';
import { Text } from '../../../../components/atoms';
import { useTranslation } from 'react-i18next';
import '../../../../helpers/i18n';
import '../../../../../polyfills';
import { Button } from '../../../../components/atoms';
import { useAppDispatch } from '@/app/hooks/useAppDispatch';
import { loginSuccess } from '@/app/redux/slices/authSlice';
import { useLoginMutation } from '@/app/services/authApi';
import { Icon } from '@/app/components/atoms/Icon';
import { BASE_URL } from '@/app/utils/Environment';
import { useBiometricAuth } from '@/app/hooks/useBiometricAuth';
import { useGlobalModal } from '@/app/hooks/useGlobalModal';
import { useBranding } from '@/app/hooks/useBranding';
import { Dropdown } from 'react-native-element-dropdown';

type LoginMethod = 'email' | 'phone';

const DIAL_CODES = [
  { label: '🇬🇹 Guatemala', value: '+502' },
  { label: '🇺🇸 USA / Canada', value: '+1' },
  { label: '🇲🇽 Mexico', value: '+52' },
  { label: '🇸🇻 El Salvador', value: '+503' },
  { label: '🇭🇳 Honduras', value: '+504' },
  { label: '🇳🇮 Nicaragua', value: '+505' },
  { label: '🇨🇷 Costa Rica', value: '+506' },
  { label: '🇵🇦 Panama', value: '+507' },
  { label: '🇨🇴 Colombia', value: '+57' },
  { label: '🇻🇪 Venezuela', value: '+58' },
  { label: '🇦🇷 Argentina', value: '+54' },
  { label: '🇧🇷 Brazil', value: '+55' },
  { label: '🇨🇱 Chile', value: '+56' },
  { label: '🇪🇸 Spain', value: '+34' },
  { label: '🇬🇧 UK', value: '+44' },
];

// Biometric store saves identifier in the 'email' field regardless of type.
// If it starts with '+' it's a phone number (E.164).
const credentialFromIdentifier = (identifier: string, password: string) =>
  identifier.startsWith('+')
    ? { phone: identifier, password }
    : { email: identifier, password };

export const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useBranding();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const { showModal } = useGlobalModal();
  const { enableBiometrics, isBiometricEnabled, authenticateWithBiometrics, getBiometricIcon } = useBiometricAuth();

  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  const [dialCode, setDialCode] = useState('+502');
  const [showPassword, setShowPassword] = useState(false);
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);
  const [bioInfo, setBioInfo] = useState<{ name: string; family: any; label: string }>({
    name: 'fingerprint', family: 'MaterialIcons', label: 'Touch ID',
  });

  React.useEffect(() => {
    const checkBiometrics = async () => {
      const isEnabled = await isBiometricEnabled();
      setBiometricsAvailable(isEnabled);
      if (isEnabled) {
        const info = await getBiometricIcon();
        setBioInfo(info);
      }
    };
    checkBiometrics();
  }, [isBiometricEnabled]);

  const validationSchema = Yup.object().shape({
    email: loginMethod === 'email'
      ? Yup.string()
          .email(t('validations.invalid', 'Invalid {{field}}', { field: t('Forms.email', 'Email') }))
          .required(t('validations.required', 'This {{field}} is required', { field: t('Forms.email', 'Email') }))
      : Yup.string(),
    phoneNumber: loginMethod === 'phone'
      ? Yup.string()
          .min(6, t('validations.min_length', 'Minimum {{length}} characters', { length: 6 }))
          .required(t('validations.required', 'This {{field}} is required', { field: t('Forms.phone', 'Phone') }))
      : Yup.string(),
    password: Yup.string()
      .min(6, t('validations.min_length', 'Minimum {{length}} characters', { length: 6 }))
      .required(t('validations.required', 'This {{field}} is required', { field: t('Forms.password', 'Password') })),
  });

  const getErrorMessage = (error: any): string => {
    const status = error?.status;
    const originalStatus = error?.originalStatus;
    const httpStatus = originalStatus || (typeof status === 'number' ? status : null);

    if (status === 'FETCH_ERROR') return t('login.errors.networkError', `Connection error (${BASE_URL}).`);
    if (status === 'TIMEOUT_ERROR') return t('login.errors.timeout', 'Request timed out. Try again.');
    if (status === 'PARSING_ERROR') {
      return httpStatus === 404
        ? t('login.errors.serviceUnavailable', 'Service unavailable.')
        : t('login.errors.serverError', `Server error (${httpStatus ?? 'unknown'}).`);
    }
    if (httpStatus && httpStatus >= 500) return t('login.errors.serverError', `Server error (${httpStatus}).`);
    if (httpStatus === 404) return t('login.errors.serviceUnavailable', 'Service unavailable.');

    const msg = error?.data?.message || error?.message || '';
    switch (msg) {
      case 'User not found':    return t('login.errors.userNotFound', 'No account found with this credential');
      case 'Invalid credentials':
      case 'Invalid password':  return t('login.errors.invalidCredentials', 'Incorrect password');
      case 'Account is disabled': return t('login.errors.accountDisabled', 'Your account has been disabled');
      case 'Too many attempts': return t('login.errors.tooManyAttempts', 'Too many attempts. Try again later');
      default:                  return t('login.errors.general', 'Login failed. Check your details and try again');
    }
  };

  const handleLogin = async (credential: { email?: string; phone?: string; password: string }) => {
    try {
      const result = await login(credential as any).unwrap();
      if (result.success) {
        const { accessToken, refreshToken, user } = result.data;
        dispatch(loginSuccess({ user, accessToken, refreshToken }));

        const biometricsEnabled = await isBiometricEnabled();
        if (!biometricsEnabled) {
          const identifier = credential.email || credential.phone || '';
          setTimeout(() => {
            showModal({
              title: t('common.enable_biometrics', 'Enable Biometrics'),
              message: t('common.biometrics_message', 'Would you like to use biometrics for future logins?'),
              onConfirm: async () => {
                setTimeout(async () => {
                  const success = await enableBiometrics(identifier, credential.password);
                  if (success) {
                    setTimeout(() => showModal({
                      title: t('common.success', 'Success'),
                      message: t('common.biometrics_enabled', 'Biometrics enabled successfully'),
                    }), 500);
                  }
                }, 300);
              },
              showCancelButton: true,
              confirmButtonText: t('common.yes', 'Yes'),
            });
          }, 800);
        }
      } else {
        showModal({ title: t('login.error', 'Login error'), message: getErrorMessage(result) });
      }
    } catch (err: any) {
      showModal({ title: t('login.error', 'Login error'), message: getErrorMessage(err) });
    }
  };

  const handleBiometricLogin = async (setFieldValue: any) => {
    const credentials = await authenticateWithBiometrics();
    if (credentials) {
      const credential = credentialFromIdentifier(credentials.email, credentials.password);
      setFieldValue('password', credentials.password);
      if (credential.phone) {
        setLoginMethod('phone');
      } else {
        setFieldValue('email', credentials.email);
      }
      handleLogin({ ...credential, password: credentials.password });
    }
  };

  const handleSubmit = (values: any) => {
    const credential = loginMethod === 'email'
      ? { email: values.email.trim(), password: values.password }
      : { phone: `${dialCode}${values.phoneNumber.trim()}`, password: values.password };
    handleLogin(credential);
  };

  return (
    <Formik
      initialValues={{ email: '', phoneNumber: '', password: '' }}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, setFieldValue }) => (
        <View style={styles.form}>

          {/* Email / Phone toggle */}
          <View style={[styles.toggle, { borderColor: colors.secondaryContainer }]}>
            <TouchableOpacity
              style={[styles.toggleTab, loginMethod === 'email' && { backgroundColor: colors.primary }]}
              onPress={() => setLoginMethod('email')}
            >
              <Text variant="body" size="medium" style={{ color: loginMethod === 'email' ? colors.onPrimary : colors.textSecondary }}>
                {t('auth.login.email_toggle', 'Email')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleTab, loginMethod === 'phone' && { backgroundColor: colors.primary }]}
              onPress={() => setLoginMethod('phone')}
            >
              <Text variant="body" size="medium" style={{ color: loginMethod === 'phone' ? colors.onPrimary : colors.textSecondary }}>
                {t('auth.login.phone_toggle', 'Phone')}
              </Text>
            </TouchableOpacity>
          </View>

          {loginMethod === 'email' ? (
            <TextInput
              placeholder={t('Forms.email', 'Email')}
              onChangeText={handleChange('email')}
              onBlur={() => handleBlur('email')}
              value={values.email}
              errorMsg={errors.email}
              variant="underlined"
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
            />
          ) : (
            <View style={styles.phoneRow}>
              <View style={styles.dialCodePicker}>
                <Dropdown
                  data={DIAL_CODES}
                  labelField="label"
                  valueField="value"
                  value={dialCode}
                  onChange={(item) => setDialCode(item.value)}
                  placeholder={t('auth.login.dial_code', 'Code')}
                  style={[styles.dropdown, { borderBottomColor: (colors as any).grey ?? '#79747E' }]}
                  selectedTextStyle={{ fontSize: 13 }}
                  containerStyle={{ width: 240 }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <TextInput
                  placeholder={t('Forms.phone', 'Phone number')}
                  onChangeText={handleChange('phoneNumber')}
                  onBlur={() => handleBlur('phoneNumber')}
                  value={values.phoneNumber}
                  errorMsg={errors.phoneNumber}
                  variant="underlined"
                  keyboardType="phone-pad"
                  returnKeyType="next"
                />
              </View>
            </View>
          )}

          <TextInput
            placeholder={t('Forms.password', 'Password')}
            onChangeText={handleChange('password')}
            onBlur={() => handleBlur('password')}
            value={values.password}
            errorMsg={errors.password}
            variant="underlined"
            secureTextEntry={!showPassword}
            endAdornment={<Icon name={showPassword ? 'eye-off' : 'eye'} onPress={() => setShowPassword((v) => !v)} />}
            onSubmitEditing={() => handleSubmit()}
          />

          <Button
            variant="filled"
            title={t('login.login', 'Login')}
            onPress={() => handleSubmit()}
            isLoading={isLoading}
            style={{ marginTop: 32 }}
          />

          {biometricsAvailable && (
            <Button
              variant="outlined"
              title={t('login.biometric_login', `Login with ${bioInfo.label}`)}
              onPress={() => handleBiometricLogin(setFieldValue)}
              style={{ marginTop: 16 }}
              startIcon={<Icon name={bioInfo.name} family={bioInfo.family} size={24} color="primary" />}
            />
          )}
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  form: {
    marginTop: 40,
    padding: 16,
  },
  toggle: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 20,
  },
  toggleTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 4,
  },
  dialCodePicker: {
    width: 120,
    paddingTop: 4,
  },
  dropdown: {
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
});
