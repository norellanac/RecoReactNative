import React, { createContext, useContext, useState, ReactNode } from 'react';
import ModalComponent from '../components/molecules/ModalComponent';
import { Text } from '../components/atoms';

interface ModalOptions {
  title: string;
  message: string;
  onConfirm?: () => void;
  confirmButtonText?: string;
  showCancelButton?: boolean;
}

interface ModalContextType {
  showModal: (options: ModalOptions) => void;
  hideModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<ModalOptions | null>(null);

  const showModal = (newOptions: ModalOptions) => {
    setOptions(newOptions);
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      {options && (
        <ModalComponent
          visible={visible}
          onClose={hideModal}
          title={options.title}
          onConfirm={() => {
            if (options.onConfirm) options.onConfirm();
            hideModal();
          }}
          confirmButtonText={options.confirmButtonText || 'OK'}
          hideCancelButton={!options.showCancelButton}
        >
          <Text variant="body" size="medium" style={{ textAlign: 'center', marginVertical: 10 }}>
            {options.message}
          </Text>
        </ModalComponent>
      )}
    </ModalContext.Provider>
  );
};

export const useGlobalModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useGlobalModal must be used within a ModalProvider');
  }
  return context;
};
