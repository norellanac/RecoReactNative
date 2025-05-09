import React, { useState } from 'react';
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
import Modal from 'react-native-modal';
import { launchImageLibrary } from 'react-native-image-picker';
import { useTranslation } from 'react-i18next';
import { useUpdateUserNameMutation } from '@/app/services/userApi';
import { ProfileStackParams } from './ProfileStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileOptions } from '../components/ProfileOptions';
import Entypo from '@expo/vector-icons/Entypo';

type Props = NativeStackScreenProps<ProfileStackParams, 'Profile'>;

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

  const handleLogout = () => {
    dispatch(logout());
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

  const handleSaveImage = () => {
    // Implementar aquí la lógica para guardar la imagen en el servidor
    Alert.alert(
      t('userProfile.success', 'Success'),
      t('userProfile.imageUpdated', 'Image updated successfully'),
    );
    setModalOpen(false);
  };

  return (
    <Screen statusBarProps={{}}>
      <View style={styles.container}>
        {/* Avatar Upload */}
        <TouchableOpacity onPress={handleImageChange}>
          <Image
            source={
              avatar
                ? { uri: avatar }
                : require('@/app/assets/img/default-Reco-image.png')
            }
            style={styles.avatar}
          />
        </TouchableOpacity>
        <Modal
          isVisible={modalOpen}
          onBackdropPress={() => setModalOpen(false)}
          onBackButtonPress={() => setModalOpen(false)}
        >
          <View style={styles.modalContent}>
            <Text
              variant="title"
              size="large"
              color="secondary"
              style={styles.modalTitle}
            >
              {t('userProfile.changeProfilePhoto', 'Change profile photo')}
            </Text>
            <Button
              variant="filled"
              title={t('userProfile.save', 'Save')}
              onPress={handleSaveImage}
            />
          </View>
        </Modal>

        {/* User Info */}
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
          endIcon={<Entypo name="edit" size={15} color="gray" />}
        />
        <Modal
          isVisible={editNameModalOpen}
          onBackdropPress={() => setEditNameModalOpen(false)}
          onBackButtonPress={() => setEditNameModalOpen(false)}
        >
          <View style={styles.modalContent}>
            <Text
              variant="title"
              size="large"
              color="secondary"
              style={styles.modalTitle}
            >
              {t('userProfile.editNameTitle', 'Edit Name')}
            </Text>
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
            <Button
              variant="filled"
              title={t('userProfile.save', 'Save')}
              onPress={handleSaveNameChanges}
            />
          </View>
        </Modal>

        <ProfileOptions navigation={navigation} user={user} />

        <Button
          variant="outlined"
          title={t('userProfile.publishServices', 'Publish my services')}
          onPress={() => navigation.navigate('')}
          style={styles.logoutButton}
        />
        <Button
          variant="filled"
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
    width: '100%',
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
