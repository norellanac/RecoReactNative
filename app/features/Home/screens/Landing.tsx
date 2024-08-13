import React from 'react';
import { View, Text } from 'react-native';
import { Screen } from '../../../components/templates';
import { HomeStackParams } from './HomeStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from './../../../components/atoms';
type Props = NativeStackScreenProps<HomeStackParams, 'Home'>;

export const LandingHome = ({ navigation } /** route */ : Props) => {
  return (
    <Screen>
      <View style={{margin: 50, alignSelf: 'stretch', flex: 1, alignContent: 'center', marginVertical: 90}}>
      <Text>Landing Home Screen</Text>
        <Button variant='elevated' title="Landing Home" onPress={() => navigation.navigate('Home')} />
        <Button variant='filled' title="Example Screen Home" onPress={() => navigation.navigate('ExampleHome')} />
      </View>
    </Screen>
  );
};
