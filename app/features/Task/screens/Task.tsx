import React from 'react';
import { Screen } from '../../../components/templates';
import { TabsExamples } from './ExamplesDev';

export const TaskPage = ({ navigation }: Props) => {
  return (
    <Screen scrollable>
      <TabsExamples />
    </Screen>
  );
};
