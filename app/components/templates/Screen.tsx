import { useTheme } from './../../theme/ThemeProvider';
import React, { ReactNode } from 'react';
import { SafeAreaView, useColorScheme } from 'react-native';

interface ScreenProps {
  children: ReactNode;
}

export const Screen: React.FC<ScreenProps> = ({ children }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const { theme, setTheme } = useTheme();
  return <SafeAreaView style={{backgroundColor: theme.colors.background, flex: 1 }}>
    {children}
  </SafeAreaView>;
};