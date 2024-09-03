import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeNavigation } from '../features/Home/screens/HomeStack';
import { ProfileNavigation } from '../features/Profile/screens/ProfileStack';
import { LandingProfile } from '../features/Profile/screens/Landing';
import { TaskPage } from '../features/Task/screens/Task';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Task') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Tasker') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          // Puedes devolver cualquier componente aquí
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#f8f9fa',
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeNavigation} />
      <Tab.Screen name="Task" component={TaskPage} />
      <Tab.Screen name="Tasker" component={ProfileNavigation} />
      <Tab.Screen name="Profile" component={LandingProfile} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
