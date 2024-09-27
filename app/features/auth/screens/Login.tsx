import { t } from 'i18next';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../../../components/atoms';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Screen } from './../../../components/templates';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParams } from './AuthStack';
import { LoginForm } from '../components/molecules';
import { Button } from '@/app/components/atoms';
import { useTranslation } from 'react-i18next';

type Props = NativeStackScreenProps<AuthStackParams, 'Login'>;

export const Login = ({ navigation }: Props) => {
  const { t } = useTranslation();
  return (
    <Screen>
      <View style={styles.container}>
        <SafeAreaView>
          <Text
            variant={'headline'}
            size={'large'}
            color="primary"
            style={{ textAlign: 'center' }}
          >
            {t('commons.app_name')}
          </Text>
          <LoginForm />
          <Text
            variant={'body'}
            size={'large'}
            color="info"
            style={{ textAlign: 'center' }}
          >
            {t('commons.forget_password')}
          </Text>
          <View style={styles.msmFood}>
            <Text
              variant={'body'}
              size={'large'}
              color="info"
              style={{ textAlign: 'center' }}
            >
              {t('login.have_not_account')}</Text>
            <Button
              variant="text"
              title={t('register.sign_up')}
              onPress={() => navigation.navigate('Register')}
            />
          </View>
        </SafeAreaView>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 20,
  },

  appName: {
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: 34,
    lineHeight: 64,
    fontStyle: 'normal',
    color: '#6750A4',
    textAlign: 'center',
  },
  forgetPass: {
    marginTop: 30,
    textAlign: 'center',
    color: '#6750A4',
    fontSize: 14,
  },
  msmFood: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    flexDirection: 'row',
  },
  txtFood: {
    marginRight: -25,
    fontSize: 14,
  },
});
