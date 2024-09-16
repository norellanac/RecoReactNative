import React from 'react';
import { TouchableOpacity, Text,  TouchableOpacityProps, ActivityIndicator } from 'react-native';
import { useTheme } from './../../theme/ThemeProvider';

type ButtonProps = TouchableOpacityProps & {
  variant: 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal';
  title: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  onPress: () => void;
};

export const Button = ({ variant, title, isLoading, disabled, onPress, style, ...props }: ButtonProps) => {
  const { theme } = useTheme();
  const { colors, buttonVariants } = theme;
  const variantStyles = buttonVariants[disabled ? `${variant}_disabled` : variant];
  const textColor = variant === 'filled' ? colors.white : variant === 'tonal' ? colors.black : colors.primary;

  const renderText = () => {
    if (isLoading) {
      return <ActivityIndicator size="small" />;
    }
    if (typeof title === 'string') {
      return <Text style={{ color: disabled ? colors.grey : textColor }}>{title}</Text>;
    }
    return title;
  };

  return (
    <TouchableOpacity
      style={[variantStyles, style]}
      {...props}
      disabled={disabled || isLoading}
      onPress={onPress}
    >
      {renderText()}
    </TouchableOpacity>
  );
};