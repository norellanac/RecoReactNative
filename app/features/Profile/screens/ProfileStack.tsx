import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LandingProfile } from './Landing';
import { ChangeLanguage } from './ChangeLanguage';

export type ProfileStackParams = {
  Profile: undefined;
  ChangeLanguage: undefined;
};

const ProfileStack = createNativeStackNavigator<ProfileStackParams>();

export const ProfileNavigation = () => {
  return (
    <ProfileStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Profile"
    >
      <ProfileStack.Screen name="Profile" component={LandingProfile} />
      <ProfileStack.Screen name="ChangeLanguage" component={ChangeLanguage} />
    </ProfileStack.Navigator>
  );
};
