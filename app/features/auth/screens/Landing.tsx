import React from 'react'
import { Button, Text, View } from 'react-native'
import { AuthStackParams } from './AuthStack'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Screen } from '../../../components/templates'

type Props = NativeStackScreenProps<AuthStackParams, 'Landing'>;

export const LandingAuth = ({ route, navigation }: Props) => {
  return (
    <Screen>
        <Text>Landing Screen</Text>
        <Button title="Login" onPress={() => navigation.navigate('Login')} />
        <Button title="Register" onPress={() => navigation.navigate('Register')} />
    </Screen>
  )
}
