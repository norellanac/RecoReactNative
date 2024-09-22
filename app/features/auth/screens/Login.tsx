import { t } from 'i18next';
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Screen } from './../../../components/templates';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParams } from './AuthStack';
import { LoginForm } from '../components/molecules';
import { Button } from '@/app/components/atoms';
import { useTranslation } from 'react-i18next';

type Props = NativeStackScreenProps<AuthStackParams, 'Login'>;

export const Login = ({navigation}: Props) => {
  const { t } = useTranslation();
  return (
    <Screen>
      <View style={styles.container}>
        <SafeAreaView>
          <Text style={styles.appName}>Workoo</Text>
          <LoginForm />
          <Text style={styles.forgetPass}>Forget Password?</Text>
          <View style={styles.msmFood}>
            <Text style={styles.txtFood}>{t('login.have_not_account')}</Text>
            <Button
              variant="text"
              title="Sign Up"
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
