import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, ActivityIndicator } from 'react-native';
import { useTheme } from './../../theme/ThemeProvider';

type ButtonProps = TouchableOpacityProps & {
  variant: 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal';
  title: string;
  isLoading?: boolean;
  disabled?: boolean;
  onPress: () => void;
};

export const Button = ({ variant, title, isLoading, disabled, onPress, style, ...props }: ButtonProps) => {
  const { theme } = useTheme();
  const variantStyles = theme.buttonVariants[variant];
  const textColor = variant == 'filled'? theme.colors.white : variant == 'tonal'? theme.colors.black: theme.colors.primary;

  const renderText = () => {
    if (isLoading) {
      return <ActivityIndicator size="small" />;
    } else if (typeof title === 'string') {
      return <Text style={{color: textColor}} >{title}</Text>;
    } else {
      return title;
    }
  };


  return (
    <TouchableOpacity style={[variantStyles, style]} {...props} disabled={disabled || isLoading} onPress={onPress} >
      {renderText()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
  },
});
