import { StyleSheet } from 'react-native';
import { typography } from './typography';
import { buttonsTheme } from './buttons';
import { colors } from './colors';

const lightTheme = {
  colors,
  buttonVariants: StyleSheet.create(buttonsTheme),
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
  textVariants: StyleSheet.create(typography),
};

const darkTheme = {
  colors,
  buttonVariants: StyleSheet.create(buttonsTheme),
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
  textVariants: StyleSheet.create(typography),
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};

export type Theme = typeof lightTheme;
