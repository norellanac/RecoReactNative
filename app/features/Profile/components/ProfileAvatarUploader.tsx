import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Alert, View, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import ModalComponent from '@/app/components/molecules/ModalComponent';
import { Avatar } from '../../../components/molecules/Avatar';
import { Icon } from '@/app/components/atoms/Icon';
import { useUpdateUserAvatarMutation } from '@/app/services/userApi';

interface ProfileAvatarUploaderProps {
  user: any;
  onAvatarUpdate?: (newAvatarUrl: string) => void;
}

export const ProfileAvatarUploader: React.FC<ProfileAvatarUploaderProps> = ({
  user,
  onAvatarUpdate,
}) => {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const [avatar, setAvatar] = useState(user?.avatarUrl || '');
  const [pendingAvatar, setPendingAvatar] = useState<string | null>(null);

  const [updateUserAvatar, { isLoading: isUpdatingAvatar }] =
    useUpdateUserAvatarMutation();

  useEffect(() => {
    setAvatar(user?.avatarUrl || '');
  }, [user?.avatarUrl]);

  const handleImageChange = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          t('userProfile.permission', 'Permission Required'),
          t(
            'userProfile.permissionMessage',
            'Permission to access camera roll is required!',
          ),
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.3, // ✅ Reducir de 0.8 a 0.3 (30% de calidad)
        compress: 0.3, // ✅ Agregar compresión adicional
        maxWidth: 200, // ✅ Reducir ancho máximo
        maxHeight: 200, // ✅ Reducir alto máximo
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImageUri = result.assets[0].uri;
        setPendingAvatar(selectedImageUri);
        setModalOpen(true);
      } else {
      }
    } catch (error) {
      Alert.alert(
        t('userProfile.error', 'Error'),
        t('userProfile.imagePickerError', 'Failed to open image picker'),
      );
    }
  };

  const handleSaveImage = async () => {
    if (!pendingAvatar || !user?.id) {
      Alert.alert(
        t('userProfile.error', 'Error'),
        t(
          'userProfile.noImageSelected',
          'No image selected or user ID missing',
        ),
      );
      return;
    }

    try {
      const getImageType = (uri: string) => {
        if (uri.toLowerCase().includes('.png')) {
          return 'image/png';
        }
        return 'image/jpeg';
      };

      const getFileExtension = (uri: string) => {
        if (uri.toLowerCase().includes('.png')) {
          return 'png';
        }
        return 'jpg'; // Default
      };

      const imageType = getImageType(pendingAvatar);
      const extension = getFileExtension(pendingAvatar);

      const formData = new FormData();
      formData.append('file', {
        uri: pendingAvatar,
        type: imageType,
        name: `avatar_${user.id}.${extension}`,
      } as any);

      const response = await updateUserAvatar({
        userId: user.id.toString(),
        formData: formData,
      }).unwrap();

      const newAvatarUrl = response.data?.avatarUrl || pendingAvatar;
      setAvatar(newAvatarUrl);
      onAvatarUpdate?.(newAvatarUrl);

      setPendingAvatar(null);
      setModalOpen(false);

      Alert.alert(
        t('userProfile.success', 'Success'),
        t('userProfile.imageUpdated', 'Image updated successfully'),
      );
    } catch (error) {
      Alert.alert(
        t('userProfile.error', 'Error'),
        t(
          'userProfile.imageUpdateFailed',
          'Failed to update image. Please try again.',
        ),
      );
    }
  };

  const handleCloseModal = () => {
    setPendingAvatar(null);
    setModalOpen(false);
  };

  return (
    <>
      <View style={styles.avatarContainer}>
        <TouchableOpacity
          onPress={handleImageChange}
          style={styles.avatarTouchable}
          activeOpacity={0.7}
        >
          <Avatar
            avatarUrl={avatar}
            name={user?.name}
            lastname={user?.lastname}
            size={125}
          />
          <View style={styles.editIconContainer}>
            <Icon
              name="camera"
              family="FontAwesome"
              size={18}
              color="#FFFFFF"
            />
          </View>
        </TouchableOpacity>
      </View>

      <ModalComponent
        visible={modalOpen}
        onClose={handleCloseModal}
        title={t('userProfile.changeProfilePhoto', 'Change profile photo')}
        confirmButtonText={t('userProfile.save', 'Save')}
        onConfirm={handleSaveImage}
        hideCancelButton={false}
        isConfirmButtonLoading={isUpdatingAvatar}
      >
        <View style={styles.modalContent}>
          {/* Preview de la imagen seleccionada */}
          {pendingAvatar ? (
            <Image
              source={{ uri: pendingAvatar }}
              style={styles.previewImage}
              resizeMode="cover"
            />
          ) : (
            <Avatar
              avatarUrl={avatar}
              name={user?.name}
              lastname={user?.lastname}
              size={150}
            />
          )}
        </View>
      </ModalComponent>
    </>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarTouchable: {
    position: 'relative',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6750A4',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  previewImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
});
