import React from 'react';
import { View } from 'react-native';
import { AuthStackParams } from './AuthStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../../components/templates';
import { Button, Text } from './../../../components/atoms';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/app/components/molecules/LanguageSwitcher';

type Props = NativeStackScreenProps<AuthStackParams, 'Landing'>;

export const LandingAuth = ({ navigation } /* route, navigation */ : Props) => {
  const { t } = useTranslation();
  return (
    <Screen>
      <View
        style={{
          margin: 50,
          alignSelf: 'stretch',
          flex: 1,
          alignContent: 'center',
          marginVertical: 90,
        }}
      >
        <Text variant={'headline'} size={'large'} color="primary">
          Workoo
        </Text>
        <LanguageSwitcher />
        <Button
          variant="filled"
          title={t('auth.landing_screen.register')}
          onPress={() => navigation.navigate('Register')}
        />
        <Button
          variant="text"
          title={t('auth.landing_screen.login')}
          onPress={() => navigation.navigate('Login')}
        />
      </View>
    </Screen>
  );
};
