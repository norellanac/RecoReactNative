import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';

const BIOMETRIC_AUTH_ENABLED_KEY = 'biometric_auth_enabled';
const USER_CREDENTIALS_KEY = 'user_credentials';

export const useBiometricAuth = () => {
  const checkBiometrics = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

    return {
      hasHardware,
      isEnrolled,
      supportedTypes,
    };
  };

  const getBiometricIcon = async (): Promise<{
    name: string;
    family: 'MaterialCommunityIcons' | 'MaterialIcons';
    label: string;
  }> => {
    const { supportedTypes } = await checkBiometrics();

    if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return {
        name: 'face-recognition',
        family: 'MaterialCommunityIcons',
        label: 'Biometric',
      };
    }

    return {
      name: 'fingerprint',
      family: 'MaterialIcons',
      label: 'Biometric',
    };
  };

  const enableBiometrics = async (email: string, password: string) => {
    try {
      const { hasHardware, isEnrolled } = await checkBiometrics();
      if (!hasHardware || !isEnrolled) {
        return false;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Enable Biometric Authentication',
        fallbackLabel: 'Use Passcode',
      });

      if (result.success) {
        await SecureStore.setItemAsync(BIOMETRIC_AUTH_ENABLED_KEY, 'true');
        await SecureStore.setItemAsync(
          USER_CREDENTIALS_KEY,
          JSON.stringify({ email, password })
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error enabling biometrics:', error);
      return false;
    }
  };

  const disableBiometrics = async () => {
    await SecureStore.deleteItemAsync(BIOMETRIC_AUTH_ENABLED_KEY);
    await SecureStore.deleteItemAsync(USER_CREDENTIALS_KEY);
  };

  const isBiometricEnabled = async () => {
    const enabled = await SecureStore.getItemAsync(BIOMETRIC_AUTH_ENABLED_KEY);
    return enabled === 'true';
  };

  const authenticateWithBiometrics = async () => {
    try {
      const isEnabled = await isBiometricEnabled();
      if (!isEnabled) return null;

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate with Biometrics',
      });

      if (result.success) {
        const credentials = await SecureStore.getItemAsync(USER_CREDENTIALS_KEY);
        return credentials ? JSON.parse(credentials) : null;
      }
      return null;
    } catch (error) {
      console.error('Error authenticating with biometrics:', error);
      return null;
    }
  };

  return {
    checkBiometrics,
    enableBiometrics,
    disableBiometrics,
    isBiometricEnabled,
    authenticateWithBiometrics,
    getBiometricIcon,
  };
};
