import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Screen } from '../../../components/templates';
import { Button } from './../../../components/atoms/Button';
import { Icon } from '@/app/components/atoms/Icon';
import Tabs from '@/app/components/molecules/Tabs';
import { ButtonExamples, InputExamples, TabsExamples } from './ExamplesDev';

export const TaskPage = ({ navigation }: Props) => {
  return (
    <Screen scrollable>
      <TabsExamples />
    </Screen>
  );
};
