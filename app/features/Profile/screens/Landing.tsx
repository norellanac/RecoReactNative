import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Screen } from '../../../components/templates';
import { Button, Text } from '../../../components/atoms';
import { useAppDispatch } from '@/app/hooks/useAppDispatch';
import { useAppSelector } from '@/app/hooks/useAppSelector';
import { selectAuth, setAuthUserState } from '@/app/redux/slices/authSlice';
import { useTranslation } from 'react-i18next';
import { ProfileStackParams } from './ProfileStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileMenuOptions } from '../components/ProfileOptions';
import { Icon } from '@/app/components/atoms/Icon';
import ModalComponent from '@/app/components/molecules/ModalComponent';
import { useHasRole } from '@/app/hooks/useHasRole';
import { useUserEvents } from '@/app/features/auth/hooks/authHooks';
import { ProfileAvatarUploader } from '../components/ProfileAvatarUploader';
import { AppVersion } from '@/app/components/molecules';
import { DIAL_CODES, parseE164 } from '@/app/utils/dialCodes';
import { useBranding } from '@/app/hooks/useBranding';

type Props = NativeStackScreenProps<ProfileStackParams, 'ProfileHome'>;

export const LandingProfile = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(selectAuth);
  const { colors } = useBranding();

  const parsedPhone = user?.phone ? parseE164(user.phone) : null;

  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [lastname, setLastname] = useState(user?.lastname || '');
  const [email, setEmail] = useState(user?.email || '');
  const [dialCode, setDialCode] = useState(parsedPhone?.dialCode ?? '+502');
  const [phoneNumber, setPhoneNumber] = useState(
    parsedPhone?.localNumber ?? '',
  );

  const isMerchant = useHasRole('Merchant');
  const { handleUpdateUserInfo, isLoading } = useUserEvents();

  const handleSwitchRole = async () => {
    try {
      const newRoles = isMerchant ? [2] : [2, 3];
      await handleUpdateUserInfo({ roles: newRoles });
    } catch {
      Alert.alert(
        t('userProfile.error', 'Error'),
        t('userProfile.updateFailed', 'Failed to update role'),
      );
    }
  };

  const handleSaveProfile = async () => {
    if (!email.trim() && !phoneNumber.trim()) {
      Alert.alert(
        t('userProfile.error', 'Error'),
        t('profile.contact.atLeastOne', 'Email or phone number is required'),
      );
      return;
    }
    try {
      await handleUpdateUserInfo({
        name,
        lastname,
        email: email.trim() || null,
        phone: phoneNumber.trim() ? `${dialCode}${phoneNumber.trim()}` : null,
      } as any);
      Alert.alert(
        t('userProfile.success', 'Success'),
        t('userProfile.profileUpdated', 'Profile updated successfully'),
      );
      setEditProfileModalOpen(false);
    } catch {
      Alert.alert(
        t('userProfile.error', 'Error'),
        t('userProfile.updateFailed', 'Failed to update profile'),
      );
    }
  };

  const handleAvatarUpdate = (newAvatarUrl: string) => {
    if (user) {
      dispatch(setAuthUserState({ ...user, avatarUrl: newAvatarUrl }));
    }
  };

  return (
    <Screen
      scrollable
      statusBarProps={{
        showBackButton: true,
        title: (
          <Text
            variant="title"
            size="medium"
            color="info"
            style={{ marginTop: 8 }}
          >
            {t('userProfile.title', 'Profile')}
          </Text>
        ),
      }}
    >
      <View style={styles.container}>
        <ProfileAvatarUploader
          user={user}
          onAvatarUpdate={handleAvatarUpdate}
        />

        <Text
          variant="title"
          size="large"
          color="secondary"
          style={styles.userName}
        >
          {user?.name || t('userProfile.defaultName', 'Name')}{' '}
          {user?.lastname || t('userProfile.defaultLastname', 'Lastname')}
        </Text>

        <Button
          variant="text"
          title={t('userProfile.editProfile', 'Edit Profile')}
          onPress={() => setEditProfileModalOpen(true)}
          endIcon={
            <Icon
              name="mode-edit"
              size={18}
              color="#6750A4"
              family="MaterialIcons"
            />
          }
        />

        <ModalComponent
          visible={editProfileModalOpen}
          onClose={() => setEditProfileModalOpen(false)}
          title={t('userProfile.editProfileTitle', 'Edit Profile')}
          confirmButtonText={t('userProfile.save', 'Save')}
          onConfirm={handleSaveProfile}
          isConfirmButtonLoading={isLoading}
        >
          <TextInput
            style={styles.input}
            placeholder={t('userProfile.name', 'Name')}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder={t('userProfile.lastname', 'Lastname')}
            value={lastname}
            onChangeText={setLastname}
          />
          <TextInput
            style={styles.input}
            placeholder={t('profile.contact.emailPlaceholder', 'Email')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <View style={styles.phoneRow}>
            <Dropdown
              data={DIAL_CODES}
              labelField="label"
              valueField="value"
              value={dialCode}
              onChange={(item) => setDialCode(item.value)}
              placeholder="Code"
              style={[
                styles.dialDropdown,
                { borderColor: colors.grey ?? '#ccc' },
              ]}
              selectedTextStyle={{ fontSize: 13 }}
              containerStyle={{ width: 250 }}
            />
            <TextInput
              style={[styles.input, styles.phoneInput]}
              placeholder={t(
                'profile.contact.phonePlaceholder',
                'Phone number',
              )}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>
        </ModalComponent>

        <ProfileMenuOptions
          navigation={navigation}
          user={user}
          onEditContact={() => setEditProfileModalOpen(true)}
        />

        <Button
          variant="filled"
          title={
            isMerchant
              ? t('userProfile.switchToUser', 'Switch to user')
              : t('userProfile.switchToMerchant', 'Become a Professional')
          }
          onPress={handleSwitchRole}
          style={[
            styles.becomeMerchantButton,
            { backgroundColor: isMerchant ? '#1C1B1F' : '#6750A4' },
          ]}
          startIcon={
            <Icon
              name={isMerchant ? 'user' : 'rocket'}
              size={24}
              color={isMerchant ? '#FFD700' : '#FF7043'}
              family="FontAwesome"
            />
          }
        />

        <AppVersion />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: -10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: 300,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: 300,
    marginVertical: 5,
  },
  dialDropdown: {
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 10,
    width: 110,
  },
  phoneInput: {
    flex: 1,
    width: undefined,
  },
  becomeMerchantButton: {
    marginTop: 20,
    width: '70%',
  },
});
