import React from 'react';
import { Text, View } from 'react-native';
import { Screen } from '../../../components/templates';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParams } from './AuthStack';
import { useAppDispatch } from '@/app/hooks/useAppDispatch';
import { loginSuccess } from '@/app/redux/slices/authSlice';
import { Button } from '@/app/components/atoms';
import { useTranslation } from 'react-i18next';
import { LoginForm } from '../components/molecules';

type Props = NativeStackScreenProps<AuthStackParams, 'Landing'>;

export const Register = ({} /** route, navigation */ : Props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleLogin = () => {
    const user = { id: '1', name: 'John Doe', email: 'john.doe@example.com' };
    dispatch(loginSuccess(user));
  };

  return (
    <Screen>
      <View>
        <Text>{t('commons.start')}</Text>
        <Text>{t('welcome_message')}</Text>
      </View>
      <View>
        <LoginForm />
        <Button onPress={handleLogin} variant="elevated" title="Login user" />
      </View>
    </Screen>
  );
};
