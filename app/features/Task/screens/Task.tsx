import React from 'react';
import { Text } from 'react-native';
import { Screen } from '../../../components/templates';
import { Button } from './../../../components/atoms';

export const TaskPage = ({ navigation } /** route */ : Props) => {
  return (
    <Screen>
      <Text>TaskPage Profile Screen</Text>
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
