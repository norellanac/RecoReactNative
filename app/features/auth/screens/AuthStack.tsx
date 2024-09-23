import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LandingAuth } from './Landing';
import { Login } from './Login';
import { Register } from './Register';

const AuthStack = createNativeStackNavigator();

export type AuthStackParams = {
  Landing: undefined;
  Login: undefined;
  Register: undefined;
};

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Landing" component={LandingAuth} />
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Register" component={Register} />
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;
