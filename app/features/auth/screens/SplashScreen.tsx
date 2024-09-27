import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../../../components/atoms';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { t } from 'i18next';
import { useTranslation } from 'react-i18next';

const SplashScreenComponent = ({ onReady }: { onReady: () => void }) => {
  const [isAppReady, setAppReady] = useState(false);
  const { t } = useTranslation();

  const appName =t('commons.app_name');

  useEffect(() => {
    const prepare = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        await Font.loadAsync({
          Roboto: require('../../../assets/fonts/Roboto-Regular.ttf'),
          'Roboto-Bold': require('../../../assets/fonts/Roboto-Bold.ttf'),
          ...Ionicons.font,
        });
        // Artificially delay for one second to simulate a slow loading experience
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppReady(true);
        onReady();
        await SplashScreen.hideAsync();
      }
    };

    prepare();
  }, [onReady]);

  return (
    <View style={styles.container}>
      <Text variant={'display'} size={'large'} color="primary">
        {appName}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});

export default SplashScreenComponent;
