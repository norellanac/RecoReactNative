import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Dimensions } from 'react-native';
import { Text } from '../../../components/atoms';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const RecoLogo = require('../../../assets/img/Reco_logo.png');

const { width, height } = Dimensions.get('window');

const SplashScreenComponent = ({ onReady }: { onReady: () => void }) => {
  const { t } = useTranslation();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

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

        startAnimations();
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        onReady();
        await SplashScreen.hideAsync();
      }
    };

    prepare();
  }, [onReady]);

  const startAnimations = () => {
    Animated.sequence([
      // 1. Logo aparece y escala
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      // 2. Texto desliza hacia arriba
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image
          source={RecoLogo}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text
          variant="title"
          size="medium"
          color="secondary"
          style={styles.tagline}
        >
          {t('splash.tagline', 'Conectando servicios de calidad')}
        </Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.indicator,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <View style={styles.dots}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </Animated.View>
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
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    height: 300,
  },
  logoImage: {
    width: 175,
    height: 175,
  },
  textContainer: {
    marginTop: -40,
    alignItems: 'flex-start',
  },
  tagline: {
    textAlign: 'center',
    opacity: 0.8,
  },
  indicator: {
    position: 'absolute',
    bottom: 80,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#7B61FF',
    width: 24,
  },
});

export default SplashScreenComponent;
