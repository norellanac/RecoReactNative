import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthorizedApp from './AuthorizedApp';
import AuthNavigator from '../features/auth/screens/AuthStack';
import { NavigationContainer } from '@react-navigation/native';
import { useAppSelector } from '../hooks/useAppSelector';
import { selectAuth } from '../redux/slices/authSlice';

const RootStack = createNativeStackNavigator();

const RootNavigator = () => {
  const authState = useAppSelector(selectAuth);
  return (
    <NavigationContainer independent>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {authState.isAuthenticated ? (
          <RootStack.Screen name="AuthorizedApp" component={AuthorizedApp} />
        ) : (
          <RootStack.Screen name="AuthStack" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
