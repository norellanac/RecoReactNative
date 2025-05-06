import React from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { useTheme } from './../../theme/ThemeProvider';
import ErrorText from './ErrorText';

type InputProps = TextInputProps & {
  variant?: 'underlined' | 'outlined' | 'rounded';
  label?: string;
  disabled?: boolean;
  errorMsg?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  color?: 'primary' | 'secondary' | string;
  defaultValue?: any;
  disableUnderline?: boolean;
  endAdornment?: React.ReactNode;
  error?: boolean;
  id?: string;
  inputComponent?: React.ElementType;
  inputProps?: object;
  inputRef?: React.Ref<any>;
  margin?: 'dense' | 'none';
  maxRows?: number | string;
  minRows?: number | string;
  multiline?: boolean;
  name?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  rows?: number | string;
  startAdornment?: React.ReactNode;
  type?: string;
  value?: any;
};

export const TextInput = ({
  variant = 'rounded',
  label,
  disabled,
  errorMsg,
  autoComplete,
  autoFocus,
  color = 'primary',
  defaultValue,
  endAdornment,
  error,
  inputProps,
  inputRef,
  maxRows,
  minRows,
  multiline,
  name,
  onChange,
  placeholder,
  readOnly,
  required,
  rows,
  startAdornment,
  type = 'text',
  value,
  style,
  ...props
}: InputProps) => {
  const { theme } = useTheme();
  const { colors, inputVariants } = theme;
  const variantStyles = inputVariants[variant];
  const colorActive =
    errorMsg || error ? colors.error : disabled ? colors.grey : colors.primary;

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
        {startAdornment ? (
          <View style={styles.iconContainer}>{startAdornment}</View>
        ) : null}
        <RNTextInput
          style={[styles.input, { color: colors.text }]}
          editable={!disabled}
          placeholderTextColor={colors.grey}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          defaultValue={defaultValue}
          multiline={multiline}
          numberOfLines={rows ? Number(rows) : undefined}
          maxLength={maxRows ? Number(maxRows) : undefined}
          minLength={minRows ? Number(minRows) : undefined}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          required={required}
          ref={inputRef}
          type={type}
          value={value}
          {...inputProps}
          {...props}
        />
        {endAdornment ? (
          <View style={styles.iconContainer}>{endAdornment}</View>
        ) : null}
      </View>
      {errorMsg && <ErrorText>{errorMsg}</ErrorText>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  fullWidth: {
    width: '100%',
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  noUnderline: {
    borderBottomWidth: 0,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
