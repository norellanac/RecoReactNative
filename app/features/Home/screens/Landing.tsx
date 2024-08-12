import React from 'react';
import { View, Text, Button } from 'react-native';
import { Screen } from '../../../components/templates';
import { HomeStackParams } from './HomeStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
type Props = NativeStackScreenProps<HomeStackParams, 'Home'>;

export const LandingHome = ({ route, navigation }: Props) => {
  return (
    <Screen>
        <Text>Landing Home Screen</Text>
        <Button title="Landing Home" onPress={() => navigation.navigate('Home')} />
        <Button title="Example Screen Home" onPress={() => navigation.navigate('ExampleHome')} />
    </Screen>
  )
}
