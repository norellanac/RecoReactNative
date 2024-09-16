import LanguageSwitcher from '@/app/components/molecules/LanguageSwitcher';
import { t } from 'i18next';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Screen } from './../../../components/templates';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParams } from './AuthStack';
import { LoginForm } from '../components/molecules';
type Props = NativeStackScreenProps<AuthStackParams, 'Login'>;

export const Login = ({} /** route, navigation  */ : Props) => {
  return (
    <Screen>
      <View>
        <Text>{t('commons.start')}</Text>
        <Text>{t('welcome_message')}</Text>
        <Text>This is the first page of your app.</Text>
        <LanguageSwitcher />
      </View>
      <View>
        <SafeAreaView>
          <LoginForm />
        </SafeAreaView>
      </View>
    </Screen>
  );
};
