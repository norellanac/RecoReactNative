import { useTheme } from './../../theme/ThemeProvider';
import React, { ReactNode } from 'react';
import { ViewStyle, TextStyle } from 'react-native';
import StatusBar from '../molecules/StatusBar';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenProps {
  children: ReactNode;
  container?: boolean;
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

export const Screen: React.FC<ScreenProps> = ({
  children,
  statusBarProps,
  container = false,
}) => {
  const { theme } = useTheme();
  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
        paddingHorizontal: container ? 10 : 0,
      }}
    >
      {statusBarProps && <StatusBar {...statusBarProps} />}
      {children}
    </SafeAreaView>
  );
};