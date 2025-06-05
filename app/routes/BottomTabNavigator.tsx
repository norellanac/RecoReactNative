import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeNavigation } from '../features/Home/screens/HomeStack';
import { TaskPage } from '../features/Task/screens/Task';
import { FavoritesNavigation } from '../features/Favorites/screens/FavoritesStack';
import { ProfileNavigation } from '../features/Profile/screens/ProfileStack';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text } from '../components/atoms';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { BusinessStepperScreen } from '../features/BusinessStepper/screens/BusinessStepperScreen';

const Tab = createBottomTabNavigator();

const isTablet = Dimensions.get('window').width >= 768;

const BottomTabNavigator = React.memo(() => {
  const { theme } = useTheme();
  const { colors } = theme;
  const { t } = useTranslation();

  {
    t('bottomTabs.home', 'Home'),
      t('bottomTabs.task', 'Task'),
      t('bottomTabs.favorites', 'Favorites'),
      t('bottomTabs.profile', 'Profile'),
      t('bottomTabs.products', 'Products');
  }

  const iconMapping = {
    Home: ['home', 'home-outline'],
    Task: ['file-tray', 'file-tray-outline'],
    Favorites: ['heart', 'heart-outline'],
    Profile: ['person', 'person-outline'],
    Products: ['cart', 'cart-outline'],
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
                {t(`bottomTabs.${route.name.toLowerCase()}`)}{' '}
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
        },
        tabBarLabelStyle: {
          display: 'none', // Oculta el estilo de etiqueta predeterminado
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeNavigation} />
      <Tab.Screen name="Products" component={BusinessStepperScreen} />
      <Tab.Screen name="Task" component={TaskPage} />
      <Tab.Screen name="Favorites" component={FavoritesNavigation} />
      <Tab.Screen name="Profile" component={ProfileNavigation} />
    </Tab.Navigator>
  );
});

const styles = StyleSheet.create({
  iconLabelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: isTablet ? 80 : 64, // Ajusta el ancho para tablets
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
