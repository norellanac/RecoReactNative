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
        <Button onPress={() => console.log('pressed')} variant="filled" title={<Text>{"+ Filled Button"}</Text>} />
        <Button onPress={() => console.log('pressed')} variant="outlined"  title="Outlined Button" />
        <Button onPress={() => console.log('pressed')} variant="text" disabled title="Disabled Text Button" />
        <Button onPress={() => console.log('pressed')} variant="text" title=" Text Button" />
        <Button onPress={() => console.log('pressed')} variant="elevated" title="Elevated Button" />
        <Button onPress={() => console.log('pressed')} variant="elevated" isLoading title="Loading Elevated Button" />
        <Button onPress={() => console.log('pressed')} variant="tonal" title="Tonal Button" />
        <Text>Landing Screen</Text>
        <Button variant='filled' title="Sign Up" onPress={() => navigation.navigate('Register')} />
        <Button variant='text' title="Log in" onPress={() => navigation.navigate('Login')} />
      </View>
    </Screen>
  );
};
