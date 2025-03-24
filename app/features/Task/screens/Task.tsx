import React from 'react';
import { Alert, Text } from 'react-native';
import { Screen } from '../../../components/templates';
import { Button } from './../../../components/atoms/Button';
import { TextInput } from './../../../components/atoms/TextInput';
import { Icon } from '@/app/components/atoms/Icon';

const onPressIcon = () => {
  Alert.alert('Handle Icon Press');
};

export const TaskPage = ({ navigation }: Props) => {
  return (
    <Screen>
      <Text>TaskPage Profile Screen</Text>

      <TextInput
        variant="underlined"
        label="Username"
        placeholder="Enter your username"
        startAdornment={<Icon name={'search'} onPress={onPressIcon} />}
        endAdornment={<Icon name={'search'} onPress={onPressIcon} />}
      />

      <TextInput
        variant="outlined"
        label="Username"
        placeholder="Enter your username"
        startAdornment={<Icon name={'search'} onPress={onPressIcon} />}
        endAdornment={<Icon name={'search'} onPress={onPressIcon} />}
      />

      <TextInput
        variant="rounded"
        label="Username"
        placeholder="Enter your username"
        startAdornment={<Icon name={'search'} onPress={onPressIcon} />}
        endAdornment={<Icon name={'search'} onPress={onPressIcon} />}
      />

      <TextInput
        variant="rounded"
        label="Password"
        placeholder="Enter your password"
        startAdornment={<Icon name={'search'} onPress={onPressIcon} />}
        endAdornment={<Icon name={'search'} onPress={onPressIcon} />}
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
