import React from 'react';
import { LandingHome } from './Landing';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ExampleHome } from './Example';


export type HomeStackParams = {
  Home: undefined;
  ExampleHome : undefined
};

const HomeStack = createNativeStackNavigator();

export const HomeNavigation = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Home">
      <HomeStack.Screen name="Home" component={LandingHome} />
      <HomeStack.Screen name="ExampleHome" component={ExampleHome} />
    </HomeStack.Navigator>
  );
};