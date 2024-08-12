import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ExampleHome, LandingHome } from '../features/Home/screens';
import { HomeNavigation } from '../features/Home/screens/HomeStack';
import { ProfileNavigation } from '../features/Profile/screens/ProfileStack';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="App" component={HomeNavigation} />
      <Tab.Screen name="Settings" component={ProfileNavigation} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;