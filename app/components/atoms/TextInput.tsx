import React from 'react';
import { View, TextInput as RNTextInput, Text, StyleSheet, TextInputProps, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './../../theme/ThemeProvider';

type InputProps = TextInputProps & {
  variant: 'underlined' | 'outlined' | 'rounded';
  label: string;
  leftIcon?: React.ReactNode;
  disabled?: boolean;
  actionIcon?: React.ReactNode;
};

export const TextInput = ({ variant, label, leftIcon, disabled, actionIcon, style, ...props }: InputProps) => {
  const { theme } = useTheme();
  const { colors, inputVariants } = theme;
  const variantStyles = inputVariants[variant];

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, variantStyles, style]}>
        {leftIcon && <Ionicons name={leftIcon + "-outline"} size={24} style={{ color: disabled ? colors.grey : colors.primary, marginLeft: 10 }} />}
        <RNTextInput
          style={[styles.input]}
          {...props}
        />
        {actionIcon && <Ionicons name={actionIcon + "-outline"} size={24} style={{ color: disabled ? colors.grey : colors.primary, marginRight: 10 }} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
});

