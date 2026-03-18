import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import Constants from 'expo-constants';
import { Screen } from '../../../components/templates';
import { Button, Text } from '../../../components/atoms';
import { useAppDispatch } from '@/app/hooks/useAppDispatch';
import { useAppSelector } from '@/app/hooks/useAppSelector';
import { selectAuth, setAuthUserState } from '@/app/redux/slices/authSlice';
import { useTranslation } from 'react-i18next';
import { useUpdateUserNameMutation } from '@/app/services/userApi';
import { ProfileStackParams } from './ProfileStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileMenuOptions } from '../components/ProfileOptions';
import { Icon } from '@/app/components/atoms/Icon';
import ModalComponent from '@/app/components/molecules/ModalComponent';
import { useHasRole } from '@/app/hooks/useHasRole';
import { useUserEvents } from '@/app/features/auth/hooks/authHooks';
import { ProfileAvatarUploader } from '../components/ProfileAvatarUploader';
import { AppVersion } from '@/app/components/molecules';

type Props = NativeStackScreenProps<ProfileStackParams, 'ProfileHome'>;

export const LandingProfile = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(selectAuth);

  const [editNameModalOpen, setEditNameModalOpen] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [lastname, setLastname] = useState(user?.lastname || '');
  const [updateUserName, { isLoading }] = useUpdateUserNameMutation();

  const isMerchant = useHasRole('Merchant');
  const { handleUpdateUserInfo } = useUserEvents();

  const handleSwitchRole = async () => {
    try {
      const newRoles = isMerchant ? [2] : [2, 3];
      await handleUpdateUserInfo({ roles: newRoles });
    } catch (error) {
      Alert.alert(
        t('userProfile.error', 'Error'),
        t('userProfile.updateFailed', 'Failed to update role'),
      );
    }
  };

  const handleSaveNameChanges = async () => {
    if (user?.id) {
      try {
        const userUpdateResponse = await updateUserName({
          userId: user.id.toString(),
          name,
          lastname,
        }).unwrap();
        dispatch(
          setAuthUserState({
            ...user,
            name,
            lastname,
          }),
        );
        Alert.alert(
          t('userProfile.success', 'Success'),
          t('userProfile.nameUpdated', 'Name updated successfully'),
        );
        setEditNameModalOpen(false);
      } catch (error) {
        Alert.alert(
          t('userProfile.error', 'Error'),
          t('userProfile.updateFailed', 'Failed to update name'),
        );
      }
    }
  };

  const handleAvatarUpdate = (newAvatarUrl: string) => {
    dispatch(
      setAuthUserState({
        ...user,
        avatarUrl: newAvatarUrl,
      }),
    );
  };

  return (
    <Screen
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
          title={t('userProfile.editName', 'Edit Name')}
          onPress={() => setEditNameModalOpen(true)}
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
          visible={editNameModalOpen}
          onClose={() => setEditNameModalOpen(false)}
          title={t('userProfile.editNameTitle', 'Edit Name')}
          confirmButtonText={t('userProfile.save', 'Save')}
          onConfirm={handleSaveNameChanges}
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
        </ModalComponent>

        <ProfileMenuOptions navigation={navigation} user={user} />

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
  becomeMerchantButton: {
    marginTop: 20,
    width: '70%',
  },
  versionContainer: {
    paddingTop: 110,
    alignItems: 'center',
    width: '100%',
  },
  versionText: {
    opacity: 0.6,
    fontSize: 12,
  },
});
