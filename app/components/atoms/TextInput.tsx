import React from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './../../theme/ThemeProvider';
import ErrorText from './ErrorText';

type InputProps = TextInputProps & {
  variant: 'underlined' | 'outlined' | 'rounded';
  label: string;
  leftIcon?: React.ReactNode;
  disabled?: boolean;
  actionIcon?: React.ReactNode;
  especialIcon: string;
  errorMsg?: string;
};

export const TextInput = ({
  variant,
  label,
  leftIcon,
  disabled,
  actionIcon,
  especialIcon,
  style,
  errorMsg,
  ...props
}: InputProps) => {
  const { theme } = useTheme();
  const { colors, inputVariants } = theme;
  const variantStyles = inputVariants[variant];
  const colorActive = errorMsg
    ? colors.error
    : disabled
      ? colors.grey
      : colors.primary;
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          variantStyles,
          style,
          { borderColor: colorActive },
        ]}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon + '-outline'}
            size={24}
            style={{
              color: colorActive,
              marginLeft: 10,
            }}
          />
        )}
        <RNTextInput style={[styles.input]} editable={!disabled} {...props} />
        {actionIcon && (
          <Ionicons
            name={actionIcon + (especialIcon ? especialIcon : '-outline')}
            size={24}
            style={{
              color: colorActive,
              marginRight: 10,
            }}
          />
        )}
      </View>
      {errorMsg && <ErrorText>{errorMsg}</ErrorText>}
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
