import React from 'react';
import { Button } from 'react-native';

type CustomButtonProps = {
  onPress: () => void;
  title: string;
};

const CustomButton: React.FC<CustomButtonProps> = ({ onPress, title }) => {
  return <Button onPress={onPress} title={title} />;
};

export default CustomButton;
