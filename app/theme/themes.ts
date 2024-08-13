import { StyleSheet } from "react-native";

const commonButtonStyles = {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 100,
  minHeight: 50,
  minWidth: 120,
};

const colors = {
  primary: "#6750A4",
  secondary: "#625B71",
  tertiary: "#7D5260",
  error: "#B3261E",
  background: "#FFFBFE",
  text: "#000000",
  black: "#000000",
  white: "#FFFFFF",
  // Add other color definitions here
};

const lightTheme = {
  colors,
  buttonVariants: StyleSheet.create({
    filled: {
      ...commonButtonStyles,
      backgroundColor: colors.primary,
    },
    outlined: {
      ...commonButtonStyles,
      backgroundColor: "transparent",
      borderColor: "#79747E",
      borderWidth: 1,
    },
    text: {
      ...commonButtonStyles,
      backgroundColor: "transparent",
      color: colors.primary,
    },
    elevated: {
      ...commonButtonStyles,
      borderWidth: 2,
      borderColor: "#FFFBFE", // Outline color
      backgroundColor: "#FFFBFE",
      // Shadow for iOS
      shadowColor: "#000",
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      // Elevation for Android
      elevation: 5,
    },
    tonal: {
      ...commonButtonStyles,
      backgroundColor: "#E8DEF8",
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
      backgroundColor: "transparent",
      borderColor: "#79747E",
      borderWidth: 1,
    },
    text: {
      ...commonButtonStyles,
      backgroundColor: "transparent",
      color: colors.primary,
    },
    elevated: {
      ...commonButtonStyles,
      borderWidth: 2,
      borderColor: "#FFFBFE", // Outline color
      backgroundColor: "#FFFBFE",
      // Shadow for iOS
      shadowColor: "#000",
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      // Elevation for Android
      elevation: 5,
    },
    tonal: {
      ...commonButtonStyles,
      backgroundColor: "#E8DEF8",
    },
  }),
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};

export type Theme = typeof lightTheme;
