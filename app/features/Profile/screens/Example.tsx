import React from 'react';
import { View, Text, Button } from 'react-native';
import { Screen } from '../../../components/templates';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParams } from './ProfileStack';
type Props = NativeStackScreenProps<ProfileStackParams, 'Profile'>;

export const ExampleProfile = ({ route, navigation }: Props) => {
  return (
    <Screen>
        <Text>Example Profile Screen</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
    </Screen>
  )
}