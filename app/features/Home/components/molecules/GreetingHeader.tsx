import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text } from '@/app/components/atoms';
import RecoIcon from '../../../../assets/img/RecoIcon.png';
import { useAppSelector } from '@/app/hooks/useAppSelector';
import { selectAuth } from '@/app/redux/slices/authSlice';
import { useTranslation } from 'react-i18next';
import { Avatar } from '@/app/components/molecules/Avatar';

export const GreetingHeader = () => {
  const { t } = useTranslation();
  const { user } = useAppSelector(selectAuth);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('home_screen.greeting_morning', 'Good Morning');
    if (hour < 18) return t('home_screen.greeting_afternoon', 'Good Afternoon');
    return t('home_screen.greeting_evening', 'Good Evening');
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Avatar
          avatarUrl={user?.avatarUrl}
          name={user?.name}
          lastname={user?.lastname}
          size={54}
        />
      </View>

      <View style={styles.greetingContainer}>
        <Text style={styles.greetingText}>{getGreeting()} 👋</Text>
        <Text style={styles.nameText}>
          {user?.name} {user?.lastname}
        </Text>
      </View>

      <View style={styles.iconContainer}>
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
  avatarContainer: {
    marginRight: 14,
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
