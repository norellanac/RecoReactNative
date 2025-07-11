import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Screen } from '../../../components/templates';
import { Button, Text } from '../../../components/atoms';
import { useAppDispatch } from '@/app/hooks/useAppDispatch';
import { useAppSelector } from '@/app/hooks/useAppSelector';
import {
  logout,
  selectAuth,
  setAuthUserState,
} from '@/app/redux/slices/authSlice';
import { launchImageLibrary } from 'react-native-image-picker';
import { useTranslation } from 'react-i18next';
import { useUpdateUserNameMutation } from '@/app/services/userApi';
import { ProfileStackParams } from './ProfileStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileOptions } from '../components/ProfileOptions';
import { Icon } from '@/app/components/atoms/Icon';
import ModalComponent from '@/app/components/molecules/ModalComponent';
import { useHasRole } from '@/app/hooks/useHasRole';
import { useUserEvents } from '@/app/features/auth/hooks/authHooks';

type Props = NativeStackScreenProps<ProfileStackParams, 'ProfileHome'>;

export const LandingProfile = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(selectAuth);

  const [editNameModalOpen, setEditNameModalOpen] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [lastname, setLastname] = useState(user?.lastname || '');
  const [updateUserName, { isLoading }] = useUpdateUserNameMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [avatar, setAvatar] = useState(user?.avatarUrl || '');
  const [pendingAvatar, setPendingAvatar] = useState<string | null>(null);
  const isMerchant = useHasRole('Merchant');
  const { handleUpdateUserInfo } = useUserEvents();

  useEffect(() => {
    setAvatar(user?.avatarUrl || '');
  }, [user?.avatarUrl]);

  const BASE_URL =
    process.env.EXPO_PUBLIC_API_URL?.replace(/\/api\/v1\/$/, '') ||
    'https://dev.recolatam.com';

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

  const handleLogout = () => {
    dispatch(logout());
  };

  const getAvatarSource = () => {
    if (avatar && avatar.startsWith('http')) {
      return { uri: avatar };
    }
    if (avatar && avatar.startsWith('/')) {
      return { uri: BASE_URL + avatar };
    }
    return require('@/app/assets/img/default-Reco-image.png');
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

  const handleImageChange = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300,
      quality: 0.8,
    });

    if (result.assets && result.assets.length > 0) {
      setAvatar(result.assets[0].uri || '');
      setModalOpen(true);
    }
  };

  // Para mostrar la imagen en el modal:
  const getModalAvatarSource = () => {
    if (pendingAvatar) return { uri: pendingAvatar };
    return getAvatarSource();
  };

  const handleSaveImage = () => {
    // Implementar aquí la lógica para guardar la imagen en el servidor
    setAvatar(pendingAvatar || avatar); // Solo actualiza si se guardó
    setPendingAvatar(null);
    setModalOpen(false);
    Alert.alert(
      t('userProfile.success', 'Success'),
      t('userProfile.imageUpdated', 'Image updated successfully'),
    );
  };

  // Si se cierra el modal sin guardar:
  const handleCloseModal = () => {
    setPendingAvatar(null);
    setModalOpen(false);
  };

  return (
    <Screen
      statusBarProps={{
        showBackButton: true,
        title: (
          <Text
            variant="headline"
            size="small"
            color="info"
            style={{ marginTop: 8 }}
          >
            {t('userProfile.title', 'Profile')}
          </Text>
        ),
      }}
    >
      <View style={styles.container}>
        {/* Avatar Upload */}
        <TouchableOpacity onPress={handleImageChange}>
          <Image source={getAvatarSource()} style={styles.avatar} />
        </TouchableOpacity>
        {/* Modal para cambiar foto */}
        <ModalComponent
          visible={modalOpen}
          onClose={handleCloseModal}
          title={t('userProfile.changeProfilePhoto', 'Change profile photo')}
          confirmButtonText={t('userProfile.save', 'Save')}
          onConfirm={handleSaveImage}
          hideCancelButton={true}
        >
          {/* Puedes agregar contenido extra aquí si lo necesitas */}
          <Image source={getModalAvatarSource()} style={styles.avatar} />
        </ModalComponent>

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

        <ProfileOptions navigation={navigation} user={user} />
        <Button
          variant="filled"
          title={
            isMerchant
              ? t('userProfile.switchToUser', 'Switch to user')
              : t('userProfile.switchToMerchant', 'Become a Professional')
          }
          onPress={handleSwitchRole}
          style={[
            styles.logoutButton,
            { backgroundColor: isMerchant ? '#019FE9' : '#6750A4' },
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
        <Button
          variant="outlined"
          title={t('userProfile.publishServices', 'Publish my services')}
          onPress={() => navigation.navigate('MyServices')}
          style={styles.logoutButton}
        />
        <Button
          variant="text"
          title={t('userProfile.logout', 'Logout')}
          onPress={handleLogout}
          style={styles.logoutButton}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  avatar: {
    width: 125,
    height: 125,
    borderRadius: 75,
    marginBottom: 10,
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
  logoutButton: {
    marginTop: 20,
    width: '80%',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
