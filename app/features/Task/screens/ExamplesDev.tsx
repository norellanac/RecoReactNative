import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, TextInput } from '@/app/components/atoms';
import { Icon } from '@/app/components/atoms/Icon';
import Tabs from '@/app/components/molecules/Tabs';

const onPressIcon = () => {
  Alert.alert('Handle Icon Press');
};

const onButtonPress = () => {
  Alert.alert('Button Pressed');
};

export const InputExamples = () => (
  <>
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
  </>
);
export const ButtonExamples = () => (
  <>
    <View style={styles.buttonContainer}>
      <Button
        variant="elevated"
        title="Landing Profile"
        onPress={onButtonPress}
      />
    </View>
    <View style={styles.buttonContainer}>
      <Button
        variant="filled"
        title="Example Screen Profile"
        onPress={onButtonPress}
      />
    </View>
    <View style={styles.buttonContainer}>
      <Button
        variant="contained"
        title="Contained Button"
        onPress={onButtonPress}
      />
    </View>
    <View style={styles.buttonContainer}>
      <Button variant="text" title="Text Button" onPress={onButtonPress} />
    </View>
    <View style={styles.buttonContainer}>
      <Button
        variant="outlined"
        title="Outlined Button"
        onPress={onButtonPress}
      />
    </View>
    <View style={styles.buttonContainer}>
      <Button
        variant="elevated"
        title="elevated Button with Start Icon"
        startIcon={<Icon name="add" />}
        onPress={onButtonPress}
      />
    </View>
    <View style={styles.buttonContainer}>
      <Button
        variant="elevated"
        title="elevated Button with End Icon"
        endIcon={<Icon name="arrow-forward" />}
        disabled={true}
        onPress={onButtonPress}
      />
    </View>
    <View style={styles.buttonContainer}>
      <Button
        variant="elevated"
        title="Loading Button"
        loading={true}
        onPress={onButtonPress}
        loadingPosition="start"
      />
    </View>
    <View style={styles.buttonContainer}>
      <Button
        variant="elevated"
        title="Full Width Button"
        fullWidth={true}
        onPress={onButtonPress}
      />
    </View>
  </>
);

export const TabsExamples = () => {
  const tabs = [
    {
      title: 'Forms',
      icon: <Icon name="form" family="AntDesign" />,
      component: <InputExamples />,
    },
    {
      title: 'Buttons',
      icon: <Icon name="gesture-tap-button" family="MaterialCommunityIcons" />,
      component: <ButtonExamples />,
    },
    {
      title: 'Tab insede Tab',
      icon: <Icon name="window-restore" family="FontAwesome" />,
      component: <TabsExamples />,
    },
  ];

  return <Tabs tabs={tabs} scrollable={false} headerBGColor={true} />;
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginVertical: 8, // Add vertical margin to each button
  },
});
