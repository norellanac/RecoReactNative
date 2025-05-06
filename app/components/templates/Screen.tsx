import { useTheme } from './../../theme/ThemeProvider';
import React, { ReactNode } from 'react';
import { ViewStyle, TextStyle, ScrollView } from 'react-native';
import StatusBar from '../molecules/StatusBar';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenProps {
  children: ReactNode;
  container?: boolean;
  scrollable?: boolean; // New prop to enable/disable scrolling
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
  scrollable = false, // Default to non-scrollable
}) => {
  const { theme } = useTheme();

  const content = scrollable ? (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: container ? 10 : 0,
      }}
    >
      {children}
    </ScrollView>
  ) : (
    <>{children}</>
  );

  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
      }}
    >
      {statusBarProps && <StatusBar {...statusBarProps} />}
      {content}
    </SafeAreaView>
  );
};