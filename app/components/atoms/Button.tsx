import React from 'react';
import {
  TouchableOpacity,
  Text,
  TouchableOpacityProps,
  ActivityIndicator,
  View,
  StyleSheet,
} from 'react-native';
import { useTheme } from './../../theme/ThemeProvider';

type ButtonProps = TouchableOpacityProps & {
  variant?: 'contained' | 'outlined' | 'text';
  title?: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' | string;
  disableElevation?: boolean;
  disableRipple?: boolean;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  loadingIndicator?: React.ReactNode;
  loadingPosition?: 'center' | 'end' | 'start';
  size?: 'small' | 'medium' | 'large' | string;
  startIcon?: React.ReactNode;
  sx?: Array<Function | object | boolean> | Function | object;
};

export const Button = ({
  variant = 'text',
  title,
  isLoading,
  disabled,
  onPress,
  color = 'primary',
  disableElevation,
  disableRipple,
  endIcon,
  fullWidth,
  loading,
  loadingIndicator,
  loadingPosition = 'center',
  size = 'medium',
  startIcon,
  sx,
  style,
  ...props
}: ButtonProps) => {
  const { theme } = useTheme();
  const { colors, buttonVariants } = theme;
  const variantStyles = buttonVariants[disabled ? `${variant}_disabled` : variant];
  const textColor =
    variant === 'filled'
      ? colors.white
      : variant === 'tonal'
        ? colors.black
        : colors.primary;
  const renderLoadingIndicator = () => {
    if (loadingIndicator) {
      return loadingIndicator;
    }
    return <ActivityIndicator color={textColor} size="small" />;
  };

  const renderContent = () => {
    if (loading) {
      if (loadingPosition === 'center') {
        return renderLoadingIndicator();
      }
      return (
        <View style={styles.loadingContainer}>
          {loadingPosition === 'start' && renderLoadingIndicator()}
          <Text style={{ color: disabled ? colors.grey : textColor }}>{title}</Text>
          {loadingPosition === 'end' && renderLoadingIndicator()}
        </View>
      );
    }

    return (
      <View style={styles.contentContainer}>
        {startIcon && <View style={styles.iconContainer}>{startIcon}</View>}
        <Text style={{ color: disabled ? colors.grey : textColor }}>{title}</Text>
        {endIcon && <View style={styles.iconContainer}>{endIcon}</View>}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[
        variantStyles,
        fullWidth && styles.fullWidth,
        disableElevation && styles.noElevation,
        style,
      ]}
      {...props}
      disabled={disabled || isLoading || loading}
      onPress={onPress}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
  noElevation: {
    elevation: 0,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginHorizontal: 4,
  },
});