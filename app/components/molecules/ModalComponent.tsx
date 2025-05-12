import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Button, Text } from '../atoms';
import { Icon } from '../atoms/Icon';

interface ModalComponentProps {
  visible: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  children: React.ReactNode;
  confirmButtonText?: string;
  cancelButtonText?: string;
  isConfirmButtonDisabled?: boolean;
  isConfirmButtonLoading?: boolean;
  hideCancelButton?: boolean;
}

const ModalComponent: React.FC<ModalComponentProps> = ({
  visible,
  onClose,
  onConfirm,
  title,
  children,
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
  isConfirmButtonDisabled = false,
  isConfirmButtonLoading = false,
  hideCancelButton = false,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="close" family="Ionicons" size={24} color="#888" />
          </TouchableOpacity>
          <Text variant="title" size="large" style={styles.title}>
            {title}
          </Text>
          <View style={styles.content}>{children}</View>
          <View style={styles.actions}>
            {!hideCancelButton && (
              <Button
                variant="outlined"
                title={cancelButtonText}
                onPress={onClose}
                style={styles.button}
              />
            )}
            {onConfirm && (
              <Button
                variant="filled"
                title={confirmButtonText}
                onPress={onConfirm}
                disabled={isConfirmButtonDisabled || isConfirmButtonLoading}
                style={styles.button}
                endIcon={
                  isConfirmButtonLoading ? (
                    <ActivityIndicator size={18} color="#fff" />
                  ) : undefined
                }
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    minWidth: 300,
    maxWidth: '90%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    elevation: 8,
  },
  closeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    zIndex: 1,
    padding: 8,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  content: {
    marginVertical: 16,
    width: '100%',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    marginHorizontal: 2,
  },
});

export default ModalComponent;
