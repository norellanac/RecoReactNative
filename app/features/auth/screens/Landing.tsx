import React from 'react'
import { Text, View } from 'react-native'
import { AuthStackParams } from './AuthStack'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Screen } from '../../../components/templates'
import { Button } from './../../../components/atoms';

type Props = NativeStackScreenProps<AuthStackParams, 'Landing'>;

export const LandingAuth = ({ navigation } /* route, navigation */ : Props) => {
  return (
    <Screen>
        <View style={{margin: 50, alignSelf: 'stretch', flex: 1, alignContent: 'center', marginVertical: 90}}>
        <Text>Landing Screen</Text>
        <Button variant='filled' title="Sign Up" onPress={() => navigation.navigate('Register')} />
        <Button variant='text' title="Log in" onPress={() => navigation.navigate('Login')} />
      </View>
    </Screen>
  );
};
