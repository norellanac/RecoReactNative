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
  variant?: 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal';
  title?: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
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
  disableElevation,
  endIcon,
  fullWidth,
  loading,
  loadingIndicator,
  loadingPosition = 'center',
  startIcon,
  style,
  ...props
}: ButtonProps) => {
  const { theme } = useTheme();
  const { colors, buttonVariants } = theme;

  // Determine the correct style based on the variant and disabled state
  const variantStyles =
    buttonVariants[disabled ? `${variant}_disabled` : variant];

  // Determine the text color based on the variant
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
    return (
      <ActivityIndicator
        color={textColor}
        size="small"
        style={{ marginHorizontal: 20 }}
      />
    );
  };

  const renderContent = () => {
    if (loading) {
      if (loadingPosition === 'center') {
        return renderLoadingIndicator();
      }
      return (
        <View style={styles.loadingContainer}>
          {loadingPosition === 'start' && renderLoadingIndicator()}
          <Text
            style={[styles.text, { color: disabled ? colors.grey : textColor }]}
          >
            {title}
          </Text>
          {loadingPosition === 'end' && renderLoadingIndicator()}
        </View>
      );
    }

    // Determine layout based on the presence of startIcon, title, and endIcon
    const hasStartIcon = !!startIcon;
    const hasEndIcon = !!endIcon;

    return (
      <View
        style={[
          styles.contentContainer,
          fullWidth &&
            (hasStartIcon && hasEndIcon
              ? styles.fullWidthContentContainer // Distribute all three elements
              : hasStartIcon
                ? styles.fullWidthStartIconContainer // Align startIcon and title
                : hasEndIcon
                  ? styles.fullWidthEndIconContainer // Align title and endIcon
                  : {}),
        ]}
      >
        {startIcon && <View style={styles.iconContainer}>{startIcon}</View>}
        <Text
          style={[
            styles.text,
            { color: disabled ? colors.grey : textColor },
            fullWidth && (hasStartIcon || hasEndIcon) && styles.fullWidthText,
          ]}
        >
          {title}
        </Text>
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
  fullWidthContentContainer: {
    justifyContent: 'space-between', // Distribute startIcon, title, and endIcon
  },
  fullWidthStartIconContainer: {
    justifyContent: 'flex-start', // Align startIcon and title
  },
  fullWidthEndIconContainer: {
    justifyContent: 'flex-end', // Align title and endIcon
  },
  iconContainer: {
    marginHorizontal: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
  fullWidthText: {
    flex: 1, // Allow the text to take up available space
    textAlign: 'center', // Center the text when only one icon is present
  },
});
