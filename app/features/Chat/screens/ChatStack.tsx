import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatListScreen from './ChatListScreen';
import ChatScreen from './ChatScreen';
import { ChatStackParams } from './types';

const Stack = createNativeStackNavigator<ChatStackParams>();

export const ChatNavigation = () => (
  <Stack.Navigator
    screenOptions={{ headerShown: false }}
    initialRouteName="ChatList"
  >
    <Stack.Screen name="ChatList" component={ChatListScreen} />
    <Stack.Screen name="ChatScreen" component={ChatScreen} />
  </Stack.Navigator>
);
