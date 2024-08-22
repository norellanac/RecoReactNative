import React from 'react';
import { Text, Button } from 'react-native';
import { Screen } from '../../../components/templates';
import { HomeStackParams } from './HomeStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
type Props = NativeStackScreenProps<HomeStackParams, 'Home'>;

export const ExampleHome = ({ navigation } /** route */ : Props) => {
  return (
    <Screen>
      <Text>Example Home Screen</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </Screen>
  );
};
