// import { StyleSheet } from 'react-native';

const lightTheme = {
  colors: {
    primary: '#6750A4',
    secondary: '#625B71',
    tertiary: '#7D5260',
    background: '#FFFBFE',
    text: '#000000',
    // Add other color definitions here
  },
};

const darkTheme = {
  colors: {
    primary: '#D0BCFF',
    secondary: '#625B71',
    tertiary: '#7D5260',
    background: '#1C1B1F',
    text: '#000000',
    // Add other color definitions here
  },
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};

export type Theme = typeof lightTheme;
