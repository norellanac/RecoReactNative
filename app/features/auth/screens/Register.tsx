import React from 'react'
import { Text, View } from 'react-native'
import { Screen } from '../../../components/templates'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParams } from './AuthStack';


type Props = NativeStackScreenProps<AuthStackParams, 'Landing'>;

export const Register = ({ route, navigation }: Props) => {
  return (
    <Screen>
        <Text>Register Scren</Text>
    </Screen>
  )
}
