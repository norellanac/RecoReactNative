import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeNavigation } from '../features/Home/screens/HomeStack';
import { TaskPage } from '../features/Task/screens/Task';
import { FavoritesNavigation } from '../features/Favorites/screens/FavoritesStack';
import { ProfileNavigation } from '../features/Profile/screens/ProfileStack';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { Text, Button } from '../components/atoms';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { BusinessNavigation } from '@/app/features/Business/screens/BusinessStack';
import { useGetOrdersQuery } from '@/app/services/ordersApi';
import { useAppSelector } from '../hooks/useAppSelector';
import { useHasRole } from '../hooks/useHasRole';
import { useUserEvents } from '@/app/features/auth/hooks/authHooks';
import { useNavigationState } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBranding } from '../hooks/useBranding';

const Tab = createBottomTabNavigator();
const isTablet = Dimensions.get('window').width >= 768;

const TaskBadge = ({ count }: { count: number }) =>
  count > 0 ? (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{count}</Text>
    </View>
  ) : null;

const BottomTabNavigator = React.memo(() => {
  const { theme } = useTheme();
  const { colors } = theme;
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

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

  const isMerchant = useHasRole('Merchant');
  const { handleUpdateUserInfo } = useUserEvents();
  const { config: brandingConfig } = useBranding();

  const navigationState = useNavigationState((state) => state);
  const currentTabRoute = navigationState.routes[navigationState.index]?.name;

  let isOnProfileHome = false;
  if (currentTabRoute === 'Profile') {
    const profileStackState =
      navigationState.routes[navigationState.index]?.state;
    const profileRouteName =
      profileStackState?.routes?.[profileStackState.index]?.name;
    isOnProfileHome = profileRouteName === 'ProfileHome';
  }

  const showFloatingButton =
    isMerchant && !(currentTabRoute === 'Profile' && isOnProfileHome);

  const handleSwitchRole = async () => {
    try {
      const newRoles = isMerchant ? [2] : [2, 3];
      await handleUpdateUserInfo({ roles: newRoles });
    } catch {}
  };

  const { ChatNavigation } = require('../features/Chat/screens/ChatStack');
  // i18next-parser-start
  // t('bottomTabs.home', 'Home')
  // t('bottomTabs.task', 'Task')
  // t('bottomTabs.products', 'Products')
  // t('bottomTabs.favorites', 'Favorites')
  // t('bottomTabs.messages', 'Messages')
  // t('bottomTabs.profile', 'Profile')
  // i18next-parser-end
  const tabScreens = [
    {
      name: 'Home',
      component: HomeNavigation,
      show: true,
    },
    {
      name: 'Task',
      component: TaskPage,
      show: !brandingConfig || brandingConfig.features.tasksEnabled,
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
      show: !brandingConfig || brandingConfig.features.chatEnabled,
    },
    {
      name: 'Profile',
      component: ProfileNavigation,
      show: true,
    },
  ];

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
                    <View style={styles.profileBadge}>
                      <FontAwesome
                        name="rocket"
                        size={12}
                        color={styles.badgeText.color}
                      />
                    </View>
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
            paddingVertical: Platform.OS === 'ios' ? 15 : 10,
            height: Platform.OS === 'ios' ? 85 + insets.bottom : 70 + insets.bottom,
            paddingBottom: Platform.OS === 'ios' ? insets.bottom : (insets.bottom > 0 ? insets.bottom : 10),
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
        <View style={styles.floatingButtonContainer}>
          <View style={styles.floatingButtonWrapper}>
            <Button
              variant="filled"
              title={t('userProfile.switchToUser', 'Switch to User')}
              onPress={handleSwitchRole}
              style={styles.floatingButton}
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
    width: isTablet ? 80 : 64,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: 32,
    borderRadius: 16,
  },
  profileBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    borderRadius: 10,
    minWidth: 28,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    zIndex: 10,
    backgroundColor: '#ff4949',
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  floatingButtonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 100,
    alignItems: 'center',
    zIndex: 100,
    pointerEvents: 'box-none',
  },
  floatingButtonWrapper: {
    width: 220,
  },
  floatingButton: {
    backgroundColor: '#1C1B1F',
    borderRadius: 24,
    elevation: 4,
  },
});

export default BottomTabNavigator;
