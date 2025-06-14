import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TaskPage } from './Task';
import TaskOrderDetailsScreen from './TaskOrderDetailsScreen';

const Stack = createNativeStackNavigator();

const TaskStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="TaskPage" component={TaskPage} />
    <Stack.Screen
      name="TaskOrderDetailsScreen"
      component={TaskOrderDetailsScreen}
    />
  </Stack.Navigator>
);

export default TaskStack;
