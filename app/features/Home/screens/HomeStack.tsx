import React from 'react';
import { LandingHome } from './Landing';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AllCategories } from '../components/molecules/AllCategories';
import { AllServices } from '../../Services/screens';

export type HomeStackParams = {
  LandingHome: undefined;
  AllCategories: undefined;
  AllServices: undefined;
};

const HomeStack = createNativeStackNavigator<HomeStackParams>();

export const HomeNavigation = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="LandingHome"
    >
      <HomeStack.Screen name="LandingHome" component={LandingHome} />
      <HomeStack.Screen name="AllCategories" component={AllCategories} />
      <HomeStack.Screen name="AllServices" component={AllServices} />
    </HomeStack.Navigator>
  );
};
