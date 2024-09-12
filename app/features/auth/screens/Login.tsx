import { t } from 'i18next';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Screen } from './../../../components/templates';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParams } from './AuthStack';
import { LoginForm } from '../components/molecules';
import { useAppDispatch } from '@/app/hooks/useAppDispatch';
import { loginSuccess } from '@/app/redux/slices/authSlice';
import { Button } from '@/app/components/atoms';
type Props = NativeStackScreenProps<AuthStackParams, 'Login'>;

export const Login = ({} /** route, navigation  */ : Props) => {
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
        <SafeAreaView>
          <LoginForm />
          <Button onPress={handleLogin} variant="elevated" title="Login user" />
        </SafeAreaView>
      </View>
    </Screen>
  );
};
