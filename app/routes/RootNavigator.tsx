import React, { useRef } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthorizedApp from './AuthorizedApp';
import AuthNavigator from '../features/auth/screens/AuthStack';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import { useAppSelector } from '../hooks/useAppSelector';
import { selectAuth } from '../redux/slices/authSlice';
import { logger } from '../utils/logging/Logger';

const RootStack = createNativeStackNavigator();

const RootNavigator = () => {
  const authState = useAppSelector(selectAuth);
  const navigationRef = useRef<NavigationContainerRef<any>>(null);
  const routeNameRef = useRef<string>();

  return (
    <NavigationContainer
      independent
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name;
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;

        if (previousRouteName !== currentRouteName) {
          logger.nav(
            '===SCREEN_VIEW===',
            `Navigated from ${previousRouteName} to ${currentRouteName}`,
            { from: previousRouteName, to: currentRouteName },
          );
        }
        routeNameRef.current = currentRouteName;
      }}
    >
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
