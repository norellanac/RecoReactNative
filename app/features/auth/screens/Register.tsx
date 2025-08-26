import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../../../components/atoms';
import { Screen } from '../../../components/templates';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParams } from './AuthStack';
import { Button } from '@/app/components/atoms';
import { useTranslation } from 'react-i18next';
import { RegisterForm } from '../components/molecules';

type Props = NativeStackScreenProps<AuthStackParams, 'Landing'>;

export const Register = ({ navigation } /** route, navigation */ : Props) => {
  const { t } = useTranslation();

  return (
    <Screen statusBarProps={{}}>
      <View style={styles.container}>
        <Text
          variant={'headline'}
          size={'large'}
          color="secondary"
          style={{ textAlign: 'left', marginHorizontal: 16, marginTop: 20 }}
        >
          {t('register.title', 'Create your account')}
        </Text>
        <RegisterForm />
        <Text
          variant={'body'}
          size={'large'}
          color="info"
          style={{ textAlign: 'center' }}
        >
          {t('register.terms_text', 'By signing up, you agree to our')}
        </Text>
        <View style={styles.terms_policy}>
          <Text
            variant={'body'}
            size={'large'}
            color="primary"
            style={{ textAlign: 'center' }}
            onPress={() => navigation.navigate('Terms')}
          >
            {t('register.terms_service', 'Terms of Service')}
          </Text>
          <Text
            variant={'body'}
            size={'large'}
            color="info"
            style={{ textAlign: 'center' }}
          >
            {t('commons.and', 'and')}{' '}
          </Text>
          <Text
            variant={'body'}
            size={'large'}
            color="primary"
            style={{ textAlign: 'center' }}
            onPress={() => navigation.navigate('PrivacyPolicy')}
          >
            {t('register.privacy_policy', 'Privacy Policy')}
          </Text>
        </View>

        <View style={styles.msmFood}>
          <Text
            variant={'body'}
            size={'large'}
            color="info"
            style={{ textAlign: 'center' }}
          >
            {t('register.already_have_an_account', 'Already have an account?')}
          </Text>
          <Button
            variant="text"
            title="Log in"
            onPress={() => navigation.navigate('Login')}
          />
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingHorizontal: 32,
    paddingTop: 60,
    justifyContent: 'center',
  },
  terms_policy: {
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    flexDirection: 'row',
  },
  msmFood: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 30,
    flexDirection: 'row',
  },
});
