import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text } from '../../../components/atoms';
import { useTranslation } from 'react-i18next';
import { Icon } from '@/app/components/atoms/Icon';
import { useAppDispatch } from '@/app/hooks/useAppDispatch';
import { logout } from '@/app/redux/slices/authSlice';
import ModalComponent from '@/app/components/molecules/ModalComponent';

export const ProfileMenuOptions = ({
  navigation,
  user,
}: {
  navigation: any;
  user: any;
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [emailClickCount, setEmailClickCount] = useState(0);

  const handleLogout = () => {
    dispatch(logout());
    setShowLogoutModal(false);
  };

  const handleLogoutPress = () => {
    setShowLogoutModal(true);
  };

  const handleCloseModal = () => {
    setShowLogoutModal(false);
  };

  const handleEmailPress = () => {
    setEmailClickCount((prev) => {
      const newCount = prev + 1;
      if (newCount >= 7) {
        navigation.navigate('LogViewer');
        return 0;
      }
      return newCount;
    });
  };

  const options = [
    {
      key: 'email',
      enabled: !!user?.email,
      label: t('userProfile.account', 'Account'),
      value: user?.email || 'email@example.com',
      icon: { name: 'person-outline', color: '#625B71', family: 'Ionicons' },
      onPress: handleEmailPress,
    },
    {
      key: 'changePassword',
      enabled: true,
      label: t('userProfile.changePassword', 'Change password'),
      value: '',
      icon: {
        name: 'lock-closed-outline',
        color: '#625B71',
        family: 'Ionicons',
      },
      onPress: () =>
        navigation.navigate('AuthStack', { screen: 'PasswordRecovery' }),
    },
    {
      key: 'changeLanguage',
      enabled: true,
      label: t('userProfile.changeLanguage', 'Change language'),
      value: '',
      icon: { name: 'language-outline', color: '#625B71', family: 'Ionicons' },
      onPress: () => navigation.navigate('ChangeLanguage'),
    },
    {
      key: 'Terms',
      enabled: true,
      label: t('userProfile.terms', 'Terms and Conditions'),
      value: '',
      icon: {
        name: 'document-text-outline',
        color: '#625B71',
        family: 'Ionicons',
      },
      onPress: () =>
        navigation.navigate('AuthStack', {
          screen: 'TermsAndConditions',
          params: {
            url: 'https://recolatam.com/terms-and-conditions',
          },
        }),
    },
    {
      key: 'PrivacyPolicy',
      enabled: true,
      label: t('userProfile.privacyPolicy', 'Privacy Policy'),
      value: '',
      icon: {
        name: 'shield-checkmark-outline',
        color: '#625B71',
        family: 'Ionicons',
      },
      onPress: () =>
        navigation.navigate('AuthStack', {
          screen: 'PrivacyPolicy',
          params: {
            url: 'https://recolatam.com/privacy-policy',
          },
        }),
    },
    {
      key: 'Logs',
      enabled: emailClickCount >= 7,
      label: t('userProfile.appLogs', 'App Logs'),
      value: '',
      icon: {
        name: 'document-attach-outline',
        color: '#625B71',
        family: 'Ionicons',
      },
      onPress: () => navigation.navigate('LogViewer'),
    },
    {
      key: 'Logout',
      enabled: true,
      label: t('userProfile.logout', 'Logout'),
      value: '',
      icon: { name: 'log-out-outline', color: '#D32F2F', family: 'Ionicons' },
      onPress: handleLogoutPress,
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
      <ModalComponent
        visible={showLogoutModal}
        onClose={handleCloseModal}
        title={
          <Text variant="title" size="large" color="error">
            {t('userProfile.logoutConfirmTitle', 'Confirm Logout')}
          </Text>
        }
        confirmButtonText={t('userProfile.logoutConfirm', 'Yes, Logout')}
        cancelButtonText={t('userProfile.cancel', 'Cancel')}
        onConfirm={handleLogout}
        hideCancelButton={false}
      >
        <View>
          <Text
            variant="body"
            size="large"
            color="secondary"
            style={styles.modalText}
          >
            {t(
              'userProfile.logoutConfirmMessage',
              'Are you sure you want to logout?',
            )}
          </Text>
        </View>
      </ModalComponent>
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
  modalText: {
    textAlign: 'center',
    lineHeight: 22,
    marginTop: -8,
    marginBottom: 16,
  },
});
