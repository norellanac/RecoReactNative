import React, { ReactNode } from 'react';
import { ViewStyle, TextStyle, ScrollView } from 'react-native';
import StatusBar from '../molecules/StatusBar';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenProps {
  children: ReactNode;
  container?: boolean;
  scrollable?: boolean; // Enable/disable scrolling
  safeAreaBackground?: string; // Custom background for SafeAreaView
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
    showBackButton?: boolean;
  };
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  statusBarProps,
  container = false,
  scrollable = false, // Default to non-scrollable
  safeAreaBackground, // Custom background prop
}) => {
  // Determinar el color de fondo del SafeAreaView
  const getSafeAreaBackground = () => {
    // 1. Si se proporciona un color personalizado, usarlo
    if (safeAreaBackground) return safeAreaBackground;

    // 2. Si hay StatusBar, usar su color de fondo
    if (statusBarProps?.backgroundColor) return statusBarProps.backgroundColor;

    // 3. Por defecto, usar blanco para mayor consistencia
    return '#FFFFFF';
  };

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
      edges={['top', 'left', 'right']}
      style={{
        backgroundColor: getSafeAreaBackground(),
        flex: 1,
      }}
    >
      {statusBarProps && <StatusBar {...statusBarProps} />}
      {content}
    </SafeAreaView>
  );
};
