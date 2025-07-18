import React from 'react';
import { View, Image } from 'react-native';
import { Text } from '@/app/components/atoms';
import { Icon } from '@/app/components/atoms/Icon';
import { getApiImageUrl } from '@/app/utils/Environment';
import { useAppSelector } from '@/app/hooks/useAppSelector';
import { selectAuth } from '@/app/redux/slices/authSlice';
import { useTranslation } from 'react-i18next';

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
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 8,
        marginHorizontal: 20,
      }}
    >
      {user?.avatarUrl ? (
        <Image
          source={getApiImageUrl(user?.avatarUrl)}
          style={{
            width: 54,
            height: 54,
            borderRadius: 27,
            marginRight: 14,
          }}
          resizeMode="cover"
        />
      ) : (
        <View
          style={{
            width: 54,
            height: 54,
            borderRadius: 27,
            marginRight: 14,
            backgroundColor: '#E0E0E0',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#6750A4' }}>
            {getInitials(user?.name, user?.lastname)}
          </Text>
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Text style={{ color: '#888', fontSize: 16 }}>{getGreeting()} 👋</Text>
        <Text style={{ fontWeight: 'bold', fontSize: 22, color: '#222' }}>
          {user?.name} {user?.lastname}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 16, marginRight: 12 }}>
        <Icon
          name="bell-outline"
          size={26}
          color="#222"
          family="MaterialCommunityIcons"
        />
      </View>
    </View>
  );
};
