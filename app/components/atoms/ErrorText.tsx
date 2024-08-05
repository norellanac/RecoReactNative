import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface ErrorTextProps {
  children: React.ReactNode;
}

const ErrorText: React.FC<ErrorTextProps> = ({ children }) => {
  return <Text style={styles.error}>{children}</Text>;
};

const styles = StyleSheet.create({
  error: {
    color: 'red',
    marginBottom: 8,
  },
});

export default ErrorText;
