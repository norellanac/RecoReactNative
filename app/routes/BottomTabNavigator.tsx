import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeNavigation } from '../features/Home/screens/HomeStack';
import { TaskPage } from '../features/Task/screens/Task';
import { FavoritesNavigation } from '../features/Favorites/screens/FavoritesStack';
import { ProfileNavigation } from '../features/Profile/screens/ProfileStack';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Button } from '../components/atoms';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { BusinessNavigation } from '@/app/features/Business/screens/BusinessStack';
import { useGetOrdersQuery } from '@/app/services/ordersApi';
import { useAppSelector } from '../hooks/useAppSelector';
import { useHasRole } from '../hooks/useHasRole';
import { useUserEvents } from '@/app/features/auth/hooks/authHooks'; // Importa tu hook global

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
    Messages: ['chatbubble', 'chatbubble-outline'],
  };

  const authUser = useAppSelector((state) => state.auth.user);
  const { data } = useGetOrdersQuery();
  const orders = data?.data || [];

  const scheduledCount = orders.filter(
    (o) => o.status === 1 && authUser && o.userId === authUser.id,
  ).length;

  const TaskBadge = ({ count }: { count: number }) =>
    count > 0 ? (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{count}</Text>
      </View>
    ) : null;

  const isMerchant = useHasRole('Merchant');
  const { handleUpdateUserInfo } = useUserEvents();

  // Para saber la ruta activa y evitar el botón flotante en Perfil
  const navigationState = globalThis?.__NAVIGATION_STATE__ || {};
  const currentRouteName =
    navigationState.routes?.[navigationState.index]?.name || '';

  // Define tabs based on role
  const { ChatNavigation } = require('../features/Chat/screens/ChatStack');
  const tabScreens = [
    {
      name: 'Home',
      component: HomeNavigation,
      show: true,
    },
    {
      name: 'Task',
      component: TaskPage,
      show: true,
      options: {
        tabBarBadge:
          scheduledCount > 0 ? <TaskBadge count={scheduledCount} /> : undefined,
      },
    },
    {
      name: 'Products',
      component: BusinessNavigation,
      show: isMerchant,
    },
    {
      name: 'Favorites',
      component: FavoritesNavigation,
      show: !isMerchant,
    },
    {
      name: 'Messages',
      component: ChatNavigation,
      show: true,
    },
    {
      name: 'Profile',
      component: ProfileNavigation,
      show: true,
    },
  ];

  // Botón flotante para cambiar a usuario (solo merchant y fuera de perfil)
  const showFloatingButton = isMerchant && currentRouteName !== 'Profile';
  const handleSwitchRole = async () => {
    try {
      await handleUpdateUserInfo({ roles: [2] }); // Cambia a solo User
    } catch (error) {
      // Maneja el error si lo necesitas
    }
  };

  return (
    <>
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
                  {route.name === 'Profile' && isMerchant && (
                    <FontAwesome
                      name="rocket"
                      size={16}
                      color="#FF7043"
                      style={{ position: 'absolute', top: -2, right: 8 }}
                    />
                  )}
                </View>
                <Text variant={'body'} size={'small'} color={'secondary'}>
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
            display: 'none',
          },
        })}
      >
        {tabScreens
          .filter((tab) => tab.show)
          .map((tab) => (
            <Tab.Screen
              key={tab.name}
              name={tab.name}
              component={tab.component}
              {...(tab.options ? { options: tab.options } : {})}
            />
          ))}
      </Tab.Navigator>
      {showFloatingButton && (
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 100,
            alignItems: 'center',
            zIndex: 100,
            pointerEvents: 'box-none',
          }}
          pointerEvents="box-none"
        >
          <View style={{ width: 220 }}>
            <Button
              variant="filled"
              title={t('userProfile.switchToUser', 'Switch to User')}
              onPress={handleSwitchRole}
              style={{
                backgroundColor: '#019FE9',
                borderRadius: 24,
                elevation: 4,
              }}
              startIcon={<FontAwesome name="user" size={20} color="#FFD700" />}
            />
          </View>
        </View>
      )}
    </>
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
  badge: {
    position: 'absolute',
    top: -4,
    right: -18,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    zIndex: 10,
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default BottomTabNavigator;
