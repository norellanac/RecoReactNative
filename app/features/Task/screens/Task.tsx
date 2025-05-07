import React from 'react';
import { Alert, Text, StyleSheet, View } from 'react-native';
import { Screen } from '../../../components/templates';
import { Button } from './../../../components/atoms/Button';
import { TextInput } from './../../../components/atoms/TextInput';
import { Icon } from '@/app/components/atoms/Icon';

const onPressIcon = () => {
  Alert.alert('Handle Icon Press');
};

export const TaskPage = ({ navigation }: Props) => {
  return (
    <Screen scrollable>
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

      <View style={styles.buttonContainer}>
        <Button
          variant="elevated"
          title="Landing Profile"
          onPress={() => navigation.navigate('Profile')}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          variant="filled"
          title="Example Screen Profile"
          onPress={() => navigation.navigate('ExampleProfile')}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          variant="contained"
          title="Contained Button"
          onPress={() => navigation.navigate('Profile')}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          variant="text"
          title="Text Button"
          onPress={() => navigation.navigate('ExampleProfile')}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          variant="outlined"
          title="Outlined Button"
          onPress={() => navigation.navigate('ExampleProfile')}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          variant="elevated"
          title="elevated Button with Start Icon"
          startIcon={<Icon name="add" />}
          onPress={() => navigation.navigate('ExampleProfile')}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          variant="elevated"
          title="elevated Button with End Icon"
          endIcon={<Icon name="arrow-forward" />}
          disabled={true}
          onPress={() => navigation.navigate('ExampleProfile')}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          variant="elevated"
          title="Loading Button"
          loading={true}
          onPress={() => navigation.navigate('ExampleProfile')}
          loadingPosition="start"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          variant="elevated"
          title="Full Width Button"
          fullWidth={true}
          onPress={() => navigation.navigate('ExampleProfile')}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginVertical: 8, // Add vertical margin to each button
  },
});