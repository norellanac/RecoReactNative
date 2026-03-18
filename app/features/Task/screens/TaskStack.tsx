import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TaskPage } from './Task';
import TaskOrderDetailsScreen from './TaskOrderDetailsScreen';
import RateScreen from '../components/RateScreen';

const Stack = createNativeStackNavigator();

const TaskStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="TaskPage" component={TaskPage} />
    <Stack.Screen
      name="TaskOrderDetailsScreen"
      component={TaskOrderDetailsScreen}
    />
    <Stack.Screen name="RateScreen" component={RateScreen} />
  </Stack.Navigator>
);

export default TaskStack;
