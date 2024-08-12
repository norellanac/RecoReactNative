import React, { ReactNode } from 'react';
import { SafeAreaView, useColorScheme } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

interface ScreenProps {
  children: ReactNode;
}

export const Screen: React.FC<ScreenProps> = ({ children }) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  return <SafeAreaView style={[backgroundStyle]}>{children}</SafeAreaView>;
};