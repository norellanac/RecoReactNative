import React from 'react';
import { Text, Button } from 'react-native';
import { Screen } from '../../../components/templates';
import { ProfileStackParams } from './ProfileStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
type Props = NativeStackScreenProps<ProfileStackParams, 'Profile'>;

export const LandingProfile = ({ navigation } /** route */ : Props) => {
  return (
    <Screen>
      <Text>Landing Profile Screen</Text>
      <Button
        title="Landing Profile"
        onPress={() => navigation.navigate('Profile')}
      />
      <Button
        title="Example Screen Profile"
        onPress={() => navigation.navigate('ExampleProfile')}
      />
    </Screen>
  );
};
