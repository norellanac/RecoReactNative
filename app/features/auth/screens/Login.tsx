import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../../../components/atoms';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Screen } from './../../../components/templates';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParams } from './AuthStack';
import { LoginForm } from '../components/molecules';
import { Button } from '@/app/components/atoms';
import { AppVersion } from '@/app/components/molecules';
import { useTranslation } from 'react-i18next';

type Props = NativeStackScreenProps<AuthStackParams, 'Login'>;

export const Login = ({ navigation }: Props) => {
  const { t } = useTranslation();
  return (
    <Screen statusBarProps={{}}>
      <View style={styles.container}>
        <SafeAreaView>
          <Text
            variant={'headline'}
            size={'large'}
            color="secondary"
            style={{ textAlign: 'left', marginHorizontal: 16 }}
          >
            {t('login.title', 'Login to your account')}
          </Text>
          <LoginForm />
          <Button
            variant="text"
            title={t('login.forget_password', 'Forgot password?')}
            onPress={() => navigation.navigate('PasswordRecovery')}
            style={{ marginTop: -16 }}
          />
          <View style={styles.msmFood}>
            <Text
              variant={'body'}
              size={'large'}
              color="info"
              style={{ textAlign: 'center' }}
            >
              {t('login.have_not_account', "Don't have an account?")}
            </Text>
            <Button
              variant="text"
              title={t('register.sign_up', 'Sign Up')}
              onPress={() => navigation.navigate('Register')}
            />
          </View>
          <AppVersion />
        </SafeAreaView>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 32,
  },
  msmFood: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    flexDirection: 'row',
  },
});
