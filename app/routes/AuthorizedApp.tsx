import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import ServicesStackNavigation from '@/app/features/Services/screens/ServicesStack';

const AuthorizedAppStack = createNativeStackNavigator();

const AuthorizedApp = () => {
  return (
    <AuthorizedAppStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthorizedAppStack.Screen
        name="MainTabs"
        component={BottomTabNavigator}
      />
      <AuthorizedAppStack.Screen
        name="ServicesStack"
        component={ServicesStackNavigation}
      />
      {/* Other authenticated screens can be added here */}
    </AuthorizedAppStack.Navigator>
  );
};

export default AuthorizedApp;
