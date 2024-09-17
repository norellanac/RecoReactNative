import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
//import roboto from '../../../assets/fonts/Roboto-Regular.ttf';

const SplashScreenComponent = ({ onReady }: { onReady: () => void }) => {
  const [isAppReady, setAppReady] = useState(false);
  const appName = 'Woorko';

  useEffect(() => {
    const prepare = async () => {
      try {
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();
        // Load fonts
        await Font.loadAsync({
          Roboto: require('../../../assets/fonts/Roboto-Regular.ttf'),
          'Roboto-Bold': require('../../../assets/fonts/Roboto-Bold.ttf'),
        });
        // Artificially delay for one second to simulate a slow loading experience
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppReady(true);
        onReady();
      }
    };

    prepare();
  }, [onReady, setAppReady]);

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.appName}>{appName}</Text>
      </View>
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
  appName: {
    fontFamily: 'Roboto',
    fontSize: 57,
    fontWeight: 'bold',
    lineHeight: 64,
    fontStyle: 'normal',
  },
});

export default SplashScreenComponent;
