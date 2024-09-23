import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Screen } from '../../../components/templates';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AuthStackParams } from './AuthStack';
import { useAppDispatch } from '@/app/hooks/useAppDispatch';
import { loginSuccess } from '@/app/redux/slices/authSlice';
import { Button } from '@/app/components/atoms';
import { useTranslation } from 'react-i18next';
import { RegisterForm } from '../components/molecules';

type Props = NativeStackScreenProps<AuthStackParams, 'Landing'>;

export const Register = ({ navigation } /** route, navigation */: Props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleLogin = () => {
    const user = { id: '1', name: 'John Doe', email: 'john.doe@example.com' };
    dispatch(loginSuccess(user));
  };

  return (
    <Screen>
      <View style={styles.container}>
        <SafeAreaView>
          <Text style={styles.appName}>Workoo</Text>
          <RegisterForm />
          <Text style={styles.description}>By signing up you agree to our</Text>
          <View style={styles.terms_policy}>
            <Text style={styles.terms}>Terms of service,</Text>
            <Text style={styles.and}> and </Text>
            <Text style={styles.policy}>Privacy Policy</Text>

          </View>

          <View style={styles.msmFood}>
            <Text style={styles.txtFood}>{t('register.already_have_an_account')}</Text>
            <Button
              variant="text"
              title="Log in"
              onPress={() => navigation.navigate('Login')}
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

  description: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 30,
  },


  terms_policy: {
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    flexDirection: 'row',
  },
  terms: {
    fontSize: 14,
    color: '#6750A4',
  },
  and: {
    fontSize: 14,
  },

  policy: {
    fontSize: 14,
    color: '#6750A4',
  },



  msmFood: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    flexDirection: 'row',
  },
  txtFood: {
    marginRight: -25,
    fontSize: 14,
  },
});
