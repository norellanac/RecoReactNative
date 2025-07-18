import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../../../components/atoms';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import LottieView from 'lottie-react-native';

const SplashScreenComponent = ({ onReady }: { onReady: () => void }) => {
  const [isAppReady, setAppReady] = useState(false);
  const { t } = useTranslation();

  const appName = t('commons.app_name', 'Reco');

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
        await new Promise((resolve) => setTimeout(resolve, 2500));
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
      <LottieView
        source={require('../../../assets/animations/RecoLogo.json')}
        autoPlay
        loop
        style={{ width: 180, height: 180 }}
      />
      {/* <Text
        variant={'display'}
        size={'large'}
        color="primary"
        style={{ marginTop: 24 }}
      >
        {appName}
      </Text> */}
      <LottieView
        source={require('../../../assets/animations/Loading animation.json')}
        autoPlay
        loop
        style={{ width: 60, height: 60, marginTop: 32 }}
      />
      {/* O usa ActivityIndicator si prefieres */}
      {/* <ActivityIndicator size="large" color="#7B61FF" style={{ marginTop: 32 }} /> */}
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
