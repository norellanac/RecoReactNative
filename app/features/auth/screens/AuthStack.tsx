import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LandingAuth } from './Landing';
import { Login } from './Login';
import { Register } from './Register';
import { TermsScreen } from '@/app/features/Profile/screens/TermsScreen';
import { PrivacyPolicyScreen } from '@/app/features/Profile/screens/PrivacyPolicyScreen';
import PasswordRecovery from './PasswordRecovery';
import TextViewScreen from '@/app/features/Profile/screens/TextViewScreen';

const AuthStack = createNativeStackNavigator();

export type AuthStackParams = {
  Landing: undefined;
  Login: undefined;
  Register: undefined;
  Terms: { url: string };
  PrivacyPolicy: { url: string };
  PasswordRecovery: undefined;
};

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Landing" component={LandingAuth} />
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Register" component={Register} />
      <AuthStack.Screen
        name="Terms"
        component={TextViewScreen}
        initialParams={{ url: 'https://recolatam.com/terms-and-conditions/' }}
      />
      <AuthStack.Screen
        name="PrivacyPolicy"
        component={TextViewScreen}
        initialParams={{ url: 'https://recolatam.com/privacy-policy/' }}
      />
      <AuthStack.Screen name="PasswordRecovery" component={PasswordRecovery} />
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;
