import React from 'react';
import { View, Text } from 'react-native';
import { Screen } from '../../../components/templates';
import { HomeStackParams } from './HomeStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from './../../../components/atoms';
type Props = NativeStackScreenProps<HomeStackParams, 'Home'>;

export const ExampleHome = ({ navigation } /** route */ : Props) => {
  return (
    <Screen>
        <Text>Example Home Screen</Text>
        <Button variant='elevated' title="Go Back" onPress={() => navigation.goBack()} />
    </Screen>
  );
};
