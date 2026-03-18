import React from 'react';
import { AuthStackParams } from './AuthStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import IntroSlider from './IntroSlider';

type Props = NativeStackScreenProps<AuthStackParams, 'Landing'>;

export const LandingAuth = ({ navigation } /* route, navigation */ : Props) => {
  return <IntroSlider />;
};
