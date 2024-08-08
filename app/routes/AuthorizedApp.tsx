import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';

const AuthorizedAppStack = createNativeStackNavigator();

const AuthorizedApp = () => {
  return (
    <AuthorizedAppStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthorizedAppStack.Screen name="MainTabs" component={BottomTabNavigator} />
      {/* Other authenticated screens can be added here */}
    </AuthorizedAppStack.Navigator>
  );
};

export default AuthorizedApp;