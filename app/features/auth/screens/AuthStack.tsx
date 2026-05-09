import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LandingAuth } from './Landing';
import { Login } from './Login';
import { Register } from './Register';
import PasswordRecovery from './PasswordRecovery';
import TextViewScreen from '@/app/features/Profile/screens/TextViewScreen';
import { useBranding } from '@/app/hooks/useBranding';

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
  const { config } = useBranding();
  const termsUrl = config?.termsUrl || 'https://recolatam.com/terms-and-conditions';
  const privacyUrl = config?.privacyUrl || 'https://recolatam.com/privacy-policy';

  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Landing" component={LandingAuth} />
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Register" component={Register} />
      <AuthStack.Screen
        name="TermsAndConditions"
        component={TextViewScreen}
        initialParams={{ url: termsUrl }}
      />
      <AuthStack.Screen
        name="PrivacyPolicy"
        component={TextViewScreen}
        initialParams={{ url: privacyUrl }}
      />
      <AuthStack.Screen name="PasswordRecovery" component={PasswordRecovery} />
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;
