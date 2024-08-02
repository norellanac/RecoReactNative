import React from 'react';
import { Button, ButtonProps } from 'react-native';

interface CustomButtonProps extends ButtonProps {
  onPress: () => void;
  title: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({ onPress, title }) => {
  return <Button onPress={onPress} title={title} />;
};

export default CustomButton;
