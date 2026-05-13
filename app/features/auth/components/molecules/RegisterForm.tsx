import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from '../../../../components/atoms';
import { Text } from '../../../../components/atoms';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../../components/atoms';
import { useAppDispatch } from '@/app/hooks/useAppDispatch';
import { loginSuccess } from '@/app/redux/slices/authSlice';
import { useLoginMutation, useSignupMutation } from '@/app/services/authApi';
import { Icon } from '@/app/components/atoms/Icon';
import { useGlobalModal } from '@/app/hooks/useGlobalModal';
import { useBiometricAuth } from '@/app/hooks/useBiometricAuth';
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

export const RegisterForm: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useBranding();
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  const [dialCode, setDialCode] = useState('+502');
  const [showPassword, setShowPassword] = useState(false);
  const [onSignup, { isLoading: isSignupLoading }] = useSignupMutation();
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const { showModal } = useGlobalModal();
  const { isBiometricEnabled, enableBiometrics } = useBiometricAuth();

  const isLoading = isSignupLoading || isLoginLoading;

  const validationSchema = Yup.object().shape({
    email:
      loginMethod === 'email'
        ? Yup.string()
            .email(t('validations.invalid', 'Invalid email'))
            .required(
              t('validations.required', 'Required', {
                field: t('auth.register.email', 'Email'),
              }),
            )
        : Yup.string(),
    phoneNumber:
      loginMethod === 'phone'
        ? Yup.string()
            .min(
              6,
              t('validations.min_length', 'Min {{length}} chars', {
                length: 6,
              }),
            )
            .required(
              t('validations.required', 'Required', {
                field: t('auth.register.phone', 'Phone number'),
              }),
            )
        : Yup.string(),
    password: Yup.string()
      .min(
        6,
        t('validations.min_length', 'Min {{length}} chars', { length: 6 }),
      )
      .required(
        t('validations.required', 'Required', {
          field: t('auth.register.password', 'Password'),
        }),
      ),
    confirmPassword: Yup.string()
      .oneOf(
        [Yup.ref('password')],
        t('validations.passwords_match', 'Passwords must match'),
      )
      .required(
        t('validations.required', 'Required', {
          field: t('auth.register.confirmPassword', 'Confirm Password'),
        }),
      ),
    isMerchant: Yup.boolean(),
  });

  const handleAutoLogin = async (
    credential: { email?: string; phone?: string },
    password: string,
  ) => {
    try {
      const result = await login({ ...credential, password } as any).unwrap();
      if (result.success) {
        const { accessToken, refreshToken, user } = result.data;
        showModal({
          title: t('register.success', 'Welcome!'),
          message: t(
            'register.welcomeMessage',
            'Your account has been created successfully.',
          ),
        });
        dispatch(loginSuccess({ user, accessToken, refreshToken }));

        const biometricsEnabled = await isBiometricEnabled();
        if (!biometricsEnabled) {
          setTimeout(() => {
            showModal({
              title: t('common.enable_biometrics', 'Enable Biometrics'),
              message: t(
                'common.biometrics_message',
                'Would you like to use biometrics for future logins?',
              ),
              onConfirm: async () => {
                const identifier = credential.email || credential.phone || '';
                const success = await enableBiometrics(identifier, password);
                if (success)
                  setTimeout(
                    () =>
                      showModal({
                        title: t('common.success', 'Success'),
                        message: t(
                          'common.biometrics_enabled',
                          'Biometrics enabled!',
                        ),
                      }),
                    500,
                  );
              },
              showCancelButton: true,
              confirmButtonText: t('common.yes', 'Yes'),
            });
          }, 800);
        }
      }
    } catch {
      showModal({
        title: t('register.error', 'Error'),
        message: t(
          'register.errors.loginAfterSignup',
          'Account created. Please log in manually.',
        ),
      });
    }
  };

  const handleSignup = async (values: any) => {
    const credential =
      loginMethod === 'email'
        ? { email: values.email.trim() }
        : { phone: `${dialCode}${values.phoneNumber.trim()}` };
    try {
      const response = await onSignup({
        ...credential,
        password: values.password,
        isMerchant: values.isMerchant,
      } as any).unwrap();
      if (response.success) {
        await handleAutoLogin(credential, values.password);
      } else {
        showModal({
          title: t('register.error', 'Error'),
          message: (response as any).message,
        });
      }
    } catch (error: any) {
      const msg =
        error?.data?.errors?.[0] ||
        error?.data?.message ||
        t('register.errors.general', 'Something went wrong. Please try again.');
      showModal({ title: t('register.error', 'Error'), message: msg });
    }
  };

  return (
    <Formik
      initialValues={{
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        isMerchant: false,
      }}
      onSubmit={handleSignup}
      validationSchema={validationSchema}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        setFieldValue,
      }) => (
        <View style={styles.form}>
          {/* Email / Phone toggle */}
          <View
            style={[styles.toggle, { borderColor: colors.secondaryContainer }]}
          >
            <TouchableOpacity
              style={[
                styles.toggleTab,
                loginMethod === 'email' && { backgroundColor: colors.primary },
              ]}
              onPress={() => setLoginMethod('email')}
            >
              <Text
                variant="body"
                size="medium"
                style={{
                  color:
                    loginMethod === 'email'
                      ? colors.onPrimary
                      : colors.textSecondary,
                }}
              >
                {t('auth.register.email_toggle', 'Email')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleTab,
                loginMethod === 'phone' && { backgroundColor: colors.primary },
              ]}
              onPress={() => setLoginMethod('phone')}
            >
              <Text
                variant="body"
                size="medium"
                style={{
                  color:
                    loginMethod === 'phone'
                      ? colors.onPrimary
                      : colors.textSecondary,
                }}
              >
                {t('auth.register.phone_toggle', 'Phone')}
              </Text>
            </TouchableOpacity>
          </View>

          {loginMethod === 'email' ? (
            <TextInput
              placeholder={t('auth.register.email', 'Email')}
              onChangeText={handleChange('email')}
              onBlur={() => handleBlur('email')}
              value={values.email}
              errorMsg={errors.email}
              variant="underlined"
              keyboardType="email-address"
              autoCapitalize="none"
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
                  placeholder={t('auth.register.dial_code', 'Code')}
                  style={[
                    styles.dropdown,
                    { borderBottomColor: colors.grey ?? '#79747E' },
                  ]}
                  selectedTextStyle={{ fontSize: 13 }}
                  containerStyle={{ width: 250 }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <TextInput
                  placeholder={t('auth.register.phone', 'Phone number')}
                  onChangeText={handleChange('phoneNumber')}
                  onBlur={() => handleBlur('phoneNumber')}
                  value={values.phoneNumber}
                  errorMsg={errors.phoneNumber}
                  variant="underlined"
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          )}

          <TextInput
            placeholder={t('auth.register.password', 'Password')}
            onChangeText={handleChange('password')}
            onBlur={() => handleBlur('password')}
            value={values.password}
            errorMsg={errors.password}
            variant="underlined"
            secureTextEntry={!showPassword}
            endAdornment={
              <Icon
                name={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword((v) => !v)}
              />
            }
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
            secureTextEntry={!showPassword}
            endAdornment={
              <Icon
                name={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword((v) => !v)}
              />
            }
            onSubmitEditing={() => handleSubmit()}
          />

          {/* Merchant toggle */}
          <View
            style={[
              styles.merchantRow,
              { backgroundColor: colors.primaryContainer },
            ]}
          >
            <Switch
              value={values.isMerchant}
              onValueChange={(v) => setFieldValue('isMerchant', v)}
              trackColor={{
                false: colors.secondaryContainer,
                true: colors.secondary,
              }}
              thumbColor={values.isMerchant ? colors.primary : '#f4f3f4'}
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="body" size="medium" style={{ fontWeight: '600' }}>
                {t('auth.register.merchant_toggle', 'I want to offer services')}
              </Text>
              <Text variant="body" size="small" color="secondary">
                {t(
                  'auth.register.merchant_description',
                  'Publish your services and receive orders',
                )}
              </Text>
            </View>
          </View>

          <Button
            variant="filled"
            title={t('register.sign_up', 'Create account')}
            onPress={() => handleSubmit()}
            isLoading={isLoading}
            style={{ marginTop: 32 }}
          />
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  form: {
    marginTop: 24,
    paddingHorizontal: 16,
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
  merchantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
});
