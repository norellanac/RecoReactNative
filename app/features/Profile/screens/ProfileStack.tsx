import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LandingProfile } from './Landing';
import { ChangeLanguage } from './ChangeLanguage';
import { BusinessStepperScreen } from '@/app/features/Business/screens/BusinessStepperScreen';
import { TermsScreen } from './TermsScreen';
import { PrivacyPolicyScreen } from './PrivacyPolicyScreen';

export type ProfileStackParams = {
  ProfileHome: undefined;
  ChangeLanguage: undefined;
  BusinessStepper: undefined;
  Terms: undefined;
  PrivacyPolicy: undefined;
};

const ProfileStack = createNativeStackNavigator<ProfileStackParams>();

export const ProfileNavigation = () => {
  return (
    <ProfileStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="ProfileHome"
    >
      <ProfileStack.Screen name="ProfileHome" component={LandingProfile} />
      <ProfileStack.Screen name="ChangeLanguage" component={ChangeLanguage} />
      <ProfileStack.Screen
        name="BusinessStepper"
        component={BusinessStepperScreen}
      />
      <ProfileStack.Screen name="Terms" component={TermsScreen} />
      <ProfileStack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
      />
    </ProfileStack.Navigator>
  );
};
