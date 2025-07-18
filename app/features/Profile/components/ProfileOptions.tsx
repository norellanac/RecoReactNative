import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text } from '../../../components/atoms';
import { useTranslation } from 'react-i18next';
import { Icon } from '@/app/components/atoms/Icon';
import { useAppDispatch } from '@/app/hooks/useAppDispatch';
import { logout } from '@/app/redux/slices/authSlice';

export const ProfileMenuOptions = ({
  navigation,
  user,
}: {
  navigation: any;
  user: any;
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const options = [
    {
      key: 'email',
      label: t('userProfile.account', 'Account'),
      value: user?.email || 'email@example.com',
      icon: { name: 'person-outline', color: '#625B71', family: 'Ionicons' },
      onPress: null,
    },
    {
      key: 'changePassword',
      label: t('userProfile.changePassword', 'Change password'),
      value: '',
      icon: {
        name: 'lock-closed-outline',
        color: '#625B71',
        family: 'Ionicons',
      },
      onPress: () => navigation.navigate(''),
    },
    {
      key: 'changeLanguage',
      label: t('userProfile.changeLanguage', 'Change language'),
      value: '',
      icon: { name: 'language-outline', color: '#625B71', family: 'Ionicons' },
      onPress: () => navigation.navigate('ChangeLanguage'),
    },
    {
      key: 'Terms',
      label: t('userProfile.terms', 'Terms and Conditions'),
      value: '',
      icon: {
        name: 'document-text-outline',
        color: '#625B71',
        family: 'Ionicons',
      },
      onPress: () => navigation.navigate('Terms'),
    },
    {
      key: 'PrivacyPolicy',
      label: t('userProfile.privacyPolicy', 'Privacy Policy'),
      value: '',
      icon: {
        name: 'shield-checkmark-outline',
        color: '#625B71',
        family: 'Ionicons',
      },
      onPress: () => navigation.navigate('PrivacyPolicy'),
    },
    {
      key: 'Logout',
      label: t('userProfile.logout', 'Logout'),
      value: '',
      icon: { name: 'log-out-outline', color: '#D32F2F', family: 'Ionicons' },
      onPress: handleLogout,
    },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={options}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={item.onPress}
            disabled={!item.onPress}
          >
            <Icon
              name={item.icon?.name}
              size={24}
              color={item.icon?.color}
              family={item.icon?.family}
            />
            <Text
              variant="title"
              size="medium"
              color={item.key === 'Logout' ? 'error' : 'secondary'}
              style={[
                styles.label,
                item.key === 'Logout' && { color: '#D32F2F' },
              ]}
            >
              {item.label}
            </Text>
            {item.value ? (
              <Text
                variant="title"
                size="small"
                color="secondary"
                style={styles.value}
              >
                {item.value}
              </Text>
            ) : (
              item.key !== 'Logout' && (
                <Icon
                  name="chevron-forward"
                  size={20}
                  color="#625B71"
                  family="Ionicons"
                />
              )
            )}
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 10,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  separator: {
    height: 1,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: 'rgb(226, 226, 230)',
  },
  label: {
    flex: 1,
    textAlign: 'left',
    marginLeft: 10,
  },
  value: {
    textAlign: 'right',
    marginLeft: -80,
  },
});
