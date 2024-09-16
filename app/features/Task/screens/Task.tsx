import React from 'react';
import { Text } from 'react-native';
import { Screen } from '../../../components/templates';
import { Button } from './../../../components/atoms/Button';
import { TextInput } from './../../../components/atoms/TextInput';

export const TaskPage = ({ navigation }: Props) => {
  return (
    <Screen>
      <Text>TaskPage Profile Screen</Text>

      <TextInput
        variant="underlined"
        label="Username"
        placeholder="Enter your username"
        leftIcon='home'
        disabled
      />

      <TextInput
        variant="outlined"
        label="Username"
        placeholder="Enter your username"
        leftIcon='document'
        disabled
      />

      <TextInput
        variant="rounded"
        label="Username"
        placeholder="Enter your username"
        leftIcon='flag'
        disabled
      />

      <TextInput
        variant="rounded"
        label="Password"
        placeholder="Enter your password"
        leftIcon="shield-half"
        actionIcon='search'
        disabled
      />


      <Button
        variant="elevated"
        title="Landing Profile"
        onPress={() => navigation.navigate('Profile')}
      />
      <Button
        variant="text"
        title="Example Screen Profile"
        onPress={() => navigation.navigate('ExampleProfile')}
      />
    </Screen>
  );
};
