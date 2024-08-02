import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  placeholder: string;
  onChangeText: (text: string) => void;
  onBlur: () => void;
  value: string;
  secureTextEntry?: boolean;
}

const Input: React.FC<InputProps> = ({ placeholder, onChangeText, onBlur, value, secureTextEntry }) => {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      onChangeText={onChangeText}
      onBlur={onBlur}
      value={value}
      secureTextEntry={secureTextEntry}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 8,
  },
});

export default Input;
