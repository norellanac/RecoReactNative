import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text } from '@/app/components/atoms';
import RecoIcon from '../../../../assets/img/RecoIcon.png';
import { getApiImageUrl } from '@/app/utils/Environment';
import { useAppSelector } from '@/app/hooks/useAppSelector';
import { selectAuth } from '@/app/redux/slices/authSlice';
import { useTranslation } from 'react-i18next';
//import { Icon } from '@/app/components/atoms/Icon';

export const GreetingHeader = () => {
  const { t } = useTranslation();
  const { user } = useAppSelector(selectAuth);

  const getInitials = (name?: string, lastname?: string) => {
    const n = name?.[0] || '';
    const l = lastname?.[0] || '';
    return (n + l).toUpperCase();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('home_screen.greeting_morning', 'Good Morning');
    if (hour < 18) return t('home_screen.greeting_afternoon', 'Good Afternoon');
    return t('home_screen.greeting_evening', 'Good Evening');
  };

  return (
    <View style={styles.container}>
      {user?.avatarUrl ? (
        <Image
          source={getApiImageUrl(user?.avatarUrl)}
          style={styles.avatar}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.initialsContainer}>
          <Text style={styles.initialsText}>
            {getInitials(user?.name, user?.lastname) ||
              t('home_screen.user', 'Dear friend')}
          </Text>
        </View>
      )}
      <View style={styles.greetingContainer}>
        <Text style={styles.greetingText}>{getGreeting()} 👋</Text>
        <Text style={styles.nameText}>
          {user?.name} {user?.lastname}
        </Text>
      </View>
      <View style={styles.iconContainer}>
        {/* <Icon
          source={getApiImageUrl(user?.avatarUrl)}
          name="bell-outline"
          size={26}
          color="#222"
          family="MaterialCommunityIcons"
        /> */}
        <Image source={RecoIcon} style={styles.recoIcon} resizeMode="contain" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
    marginHorizontal: 20,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 14,
  },
  initialsContainer: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 14,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6750A4',
  },
  greetingContainer: {
    flex: 1,
  },
  greetingText: {
    color: '#888',
    fontSize: 16,
  },
  nameText: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#222',
  },
  iconContainer: {
    flexDirection: 'row',
    gap: 16,
    marginRight: 12,
  },
  recoIcon: {
    width: 28,
    height: 28,
  },
});
