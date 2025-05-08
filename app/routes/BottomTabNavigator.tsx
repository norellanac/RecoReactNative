import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeNavigation } from '../features/Home/screens/HomeStack';
import { ProfileNavigation } from '../features/Profile/screens/ProfileStack';
import { LandingProfile } from '../features/Profile/screens/Landing';
import { TaskPage } from '../features/Task/screens/Task';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text } from '../components/atoms';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';

const Tab = createBottomTabNavigator();

const isTablet = Dimensions.get('window').width >= 768;

const BottomTabNavigator = React.memo(() => {
  const { theme } = useTheme();
  const { colors } = theme;
  const iconMapping = {
    Home: ['home', 'home-outline'],
    Task: ['file-tray', 'file-tray-outline'],
    Tasker: ['heart', 'heart-outline'],
    Profile: ['person', 'person-outline'],
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = focused
            ? iconMapping[route.name][0]
            : iconMapping[route.name][1];

          return (
            <View style={styles.iconLabelContainer}>
              <View
                style={[
                  styles.iconContainer,
                  focused && { backgroundColor: colors.secondary_container },
                ]}
              >
                <Ionicons name={iconName} size={size || 24} color={color} />
              </View>
              <Text variant={'body'} size={'medium'} color={'secondary'}>
                {route.name}
              </Text>
            </View>
          );
        },
        tabBarActiveTintColor: colors.black,
        tabBarInactiveTintColor: colors.grey,
        tabBarStyle: {
          backgroundColor: colors.background,
          paddingVertical: 15,
          minHeight: 70,
          bottom: 15, // Ajusta la posición desde la parte inferior
        },
        tabBarLabelStyle: {
          display: 'none', // Hide the default label style
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeNavigation} />
      <Tab.Screen name="Task" component={TaskPage} />
      <Tab.Screen name="Tasker" component={ProfileNavigation} />
      <Tab.Screen name="Profile" component={LandingProfile} />
    </Tab.Navigator>
  );
});

const styles = StyleSheet.create({
  iconLabelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: isTablet ? 80 : 64, // Adjust width for tablets
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: 32,
    borderRadius: 16,
  },
});

export default BottomTabNavigator;
