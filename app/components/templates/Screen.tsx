import React, { ReactNode } from 'react';
import { ViewStyle, TextStyle, ScrollView, View, StatusBar as RNStatusBar, Platform } from 'react-native';
import StatusBar from '../molecules/StatusBar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenProps {
  children: ReactNode;
  container?: boolean;
  scrollable?: boolean; // Enable/disable scrolling
  safeAreaBottom?: boolean; // Include bottom safe area edge
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
  safeAreaBottom = false,
  safeAreaBackground, // Custom background prop
}) => {
  const insets = useSafeAreaInsets();

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
    <View
      style={{
        backgroundColor: getSafeAreaBackground(),
        flex: 1,
        paddingTop: Platform.OS === 'android' ? 0 : insets.top,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        paddingBottom: safeAreaBottom ? insets.bottom : 0,
      }}
    >
      {Platform.OS === 'android' && (
        <RNStatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
      )}
      {statusBarProps && (
        <View style={Platform.OS === 'android' ? { paddingTop: insets.top } : null}>
          <StatusBar {...statusBarProps} />
        </View>
      )}
      {content}
    </View>
  );
};
