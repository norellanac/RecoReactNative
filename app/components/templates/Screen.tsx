import { useTheme } from './../../theme/ThemeProvider';
import React, { ReactNode } from 'react';
import { SafeAreaView, ViewStyle, TextStyle } from 'react-native';
import StatusBar from '../molecules/StatusBar';

interface ScreenProps {
  children: ReactNode;
  statusBarProps?: {
    leftElement?: React.ReactNode;
    onLeftIconPress?: () => void;
    title?: React.ReactNode;
    onTitlePress?: () => void;
    rightElement?: React.ReactNode;
    onRightIconPress?: () => void;
    backgroundColor?: string;
    textColor?: string;
    iconColor?: string;
    containerStyle?: ViewStyle;
    textStyle?: TextStyle;
  };
}

export const Screen: React.FC<ScreenProps> = ({ children, statusBarProps }) => {
  const { theme } = useTheme();
  return (
    <SafeAreaView style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      {statusBarProps && <StatusBar {...statusBarProps} />}
      {children}
    </SafeAreaView>
  );
};