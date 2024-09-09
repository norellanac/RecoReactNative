import React from 'react';
import { View, Text } from 'react-native';
import { Screen } from '../../../components/templates';
import { HomeStackParams } from './HomeStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from './../../../components/atoms/Button';
import { TextInput } from './../../../components/atoms/TextInput';

type Props = NativeStackScreenProps<HomeStackParams, 'Home'>;

export const LandingHome = ({ navigation } /** route */: Props) => {
  return (
    <Screen>
      <View
        style={{
          margin: 50,
          alignSelf: 'stretch',
          flex: 1,
          alignContent: 'center',
          marginVertical: 90,
        }}
      >
        <Text>Landing Home Screen</Text>

        <TextInput
          variant="underlined"
          label="Username"
          placeholder="Enter your username"
          leftIcon='home'
        />

        <TextInput
          variant="outlined"
          label="Username"
          placeholder="Enter your username"
          leftIcon='document'
        />

        <TextInput
          variant="rounded"
          label="Username"
          placeholder="Enter your username"
          leftIcon='flag'
        />

        <TextInput
          variant="rounded"
          label="Password"
          placeholder="Enter your password"
          leftIcon="shield-half"
          actionIcon='search'

        />

        <Button
          variant="elevated"
          title="Landing Home"
          onPress={() => navigation.navigate('Home')}
        />
        <Button
          variant="filled"
          title="Example Screen Home"
          onPress={() => navigation.navigate('ExampleHome')}
        />
      </View>
    </Screen>
  );
};
