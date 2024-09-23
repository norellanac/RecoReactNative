import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeNavigation } from '../features/Home/screens/HomeStack';
import { ProfileNavigation } from '../features/Profile/screens/ProfileStack';
import { LandingProfile } from '../features/Profile/screens/Landing';
import { TaskPage } from '../features/Task/screens/Task';
import { View, StyleSheet } from 'react-native';
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
            iconName = focused ? 'file-tray' : 'file-tray-outline';
          } else if (route.name === 'Tasker') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return (
            <View
              style={[
                styles.iconContainer,
                focused && styles.focusedIconContainer,
              ]}
            >
              <Ionicons name={iconName} size={24} color={color} />
            </View>
          );
        },
        tabBarActiveTintColor: '#1D192B',
        tabBarInactiveTintColor: '#817c8d',
        tabBarStyle: {
          backgroundColor: '#f8f9fa',
          paddingTop: 5,
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontFamily: 'Roboto',
          fontWeight: '500',
          fontSize: 12,
          lineHeight: 16,
          textAlign: 'center',
          letterSpacing: 1,
          color: '#817c8d',
        },
        tabBarIconStyle: {
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
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

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 64,
    height: 32,
    borderRadius: 16,
  },
  focusedIconContainer: {
    backgroundColor: '#E8DEF8',
  },
});

export default BottomTabNavigator;
