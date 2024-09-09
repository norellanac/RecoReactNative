import { StyleSheet } from 'react-native';

const commonButtonStyles = {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 100,
  minHeight: 50,
  minWidth: 120,
};

const colors = {
  primary: '#6750A4',
  secondary: '#625B71',
  tertiary: '#7D5260',
  error: '#B3261E',
  primary_container: '#EADDFF',
  secondary_container: '#E8DEF8',
  tertiary_container: '#FFD8E4',
  error_container: '#F9DEDC',
  background: '#FFFBFE',
  text: '#000000',
  black: '#000000',
  white: '#FFFFFF',
  grey: '#79747E',
  softgrey: '#E8E8E8',
  // Add other color definitions here
};

const lightTheme = {
  colors,
  buttonVariants: StyleSheet.create({
    filled: {
      ...commonButtonStyles,
      backgroundColor: colors.primary,
    },
    filled_disabled: {
      ...commonButtonStyles,
      backgroundColor: colors.grey,
      opacity: 0.5,
    },
    outlined: {
      ...commonButtonStyles,
      backgroundColor: 'transparent',
      borderColor: colors.grey,
      borderWidth: 1,
    },
    outlined_disabled: {
      ...commonButtonStyles,
      borderColor: colors.grey,
      borderWidth: 1,
      opacity: 0.5,
    },
    text: {
      ...commonButtonStyles,
      backgroundColor: 'transparent',
      color: colors.primary,
    },
    text_disabled: {
      ...commonButtonStyles,
      backgroundColor: 'transparent',
      color: colors.grey,
      opacity: 0.5,
    },
    elevated: {
      ...commonButtonStyles,
      borderWidth: 2,
      borderColor: colors.background, // Outline color
      backgroundColor: colors.background,
      // Shadow for iOS
      shadowColor: '#000',
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      // Elevation for Android
      elevation: 5,
    },
    elevated_disabled: {
      ...commonButtonStyles,
      borderWidth: 2,
      borderColor: colors.background, // Outline color
      backgroundColor: colors.background,
      // Shadow for iOS
      shadowColor: '#000',
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      // Elevation for Android
      elevation: 5,
      opacity: 0.5,
    },
    tonal: {
      ...commonButtonStyles,
      backgroundColor: colors.secondary_container,
    },
    tonal_disabled: {
      ...commonButtonStyles,
      backgroundColor: colors.grey,
      opacity: 0.5,
    },
  }),
  inputVariants: StyleSheet.create({
    underlined: {
      borderBottomWidth: 1,
      borderBottomColor: colors.grey,
    },
    outlined: {
      borderWidth: 1,
      borderColor: colors.grey,
      borderRadius: 4,
      backgroundColor: colors.white,
    },
    rounded: {
      borderWidth: 1,
      borderColor: colors.grey,
      borderRadius: 28,
      backgroundColor: colors.background,
    },
  }),
};

const darkTheme = {
  colors,
  buttonVariants: StyleSheet.create({
    filled: {
      ...commonButtonStyles,
      backgroundColor: colors.primary,
    },
    outlined: {
      ...commonButtonStyles,
      backgroundColor: 'transparent',
      borderColor: '#79747E',
      borderWidth: 1,
    },
    text: {
      ...commonButtonStyles,
      backgroundColor: 'transparent',
      color: colors.primary,
    },
    elevated: {
      ...commonButtonStyles,
      borderWidth: 2,
      borderColor: '#FFFBFE', // Outline color
      backgroundColor: '#FFFBFE',
      // Shadow for iOS
      shadowColor: '#000',
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      // Elevation for Android
      elevation: 5,
    },
    tonal: {
      ...commonButtonStyles,
      backgroundColor: '#E8DEF8',
    },
  }),
  inputVariants: StyleSheet.create({
    underlined: {
      borderBottomWidth: 1,
      borderBottomColor: colors.grey,
    },
    outlined: {
      borderWidth: 1,
      borderColor: colors.grey,
      borderRadius: 4,
      backgroundColor: colors.background,
    },
    rounded: {
      borderWidth: 1,
      borderColor: colors.grey,
      borderRadius: 28,
      backgroundColor: colors.background,
    },
  }),
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};

export type Theme = typeof lightTheme;
