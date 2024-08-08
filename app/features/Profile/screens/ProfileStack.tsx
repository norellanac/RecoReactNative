import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LandingProfile } from './Landing';
import { ExampleProfile } from './Example';


export type ProfileStackParams = {
  Profile: undefined;
  ExampleProfile : undefined
};

const HomeStack = createNativeStackNavigator();

export const ProfileNavigation = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Profile">
      <HomeStack.Screen name="Profile" component={LandingProfile} />
      <HomeStack.Screen name="ExampleProfile" component={ExampleProfile} />
    </HomeStack.Navigator>
  );
};