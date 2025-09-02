import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import ServicesStackNavigation from '@/app/features/Services/screens/ServicesStack';
import TaskStack from '@/app/features/Task/screens/TaskStack';
import { ChatNavigation } from '@/app/features/Chat/screens/ChatStack';

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
      <AuthorizedAppStack.Screen name="TaskStack" component={TaskStack} />
      <AuthorizedAppStack.Screen name="ChatStack" component={ChatNavigation} />
      {/* Other authenticated screens can be added here */}
    </AuthorizedAppStack.Navigator>
  );
};

export default AuthorizedApp;
