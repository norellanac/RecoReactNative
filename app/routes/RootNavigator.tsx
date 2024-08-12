import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthorizedApp from './AuthorizedApp';
import AuthNavigator from '../features/auth/screens/AuthStack';
import { NavigationContainer } from '@react-navigation/native';

const RootStack = createNativeStackNavigator();

const RootNavigator = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  return (
    <NavigationContainer independent>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
            <RootStack.Screen name="AuthorizedApp" component={AuthorizedApp} />
        ) : (
            <RootStack.Screen name="AuthStack" component={AuthNavigator} />
        )}
        </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;