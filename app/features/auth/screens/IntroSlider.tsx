import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

const SliderScreenComponent = ({ onReady }: { onReady: () => void }) => {
  const [isAppSlider, setAppSlider] = useState(false);
  const appName = 'Workoo';

  useEffect(() => {
    const prepare = async () => {
      try {
        await Font.loadAsync({
          Roboto: require('../../../assets/fonts/Roboto-Regular.ttf'),
          'Roboto-Bold': require('../../../assets/fonts/Roboto-Bold.ttf'),
        });
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppSlider(true);
        // onReady();
      }
    };

    prepare();
  }, [onReady, setAppSlider]);

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.appName}>{appName}</Text>
        <Text style={styles.comment}>
          Easily manage your tasks and establish a network of preferred on
          Workoo
        </Text>
        <Image
          source={require('../../../assets/img/Group_4.png')}
          style={styles.img}
        />
        <Text style={styles.textDown}>
          Get Started <Ionicons name="chevron-forward-outline" size={18} />
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  appName: {
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: 24,
    lineHeight: 64,
    fontStyle: 'normal',
    color: '#6750A4',
  },
  comment: {
    fontSize: 24,
    marginTop: 80,
    textAlign: 'center',
  },
  textDown: {
    color: '#6750A4',
    fontSize: 16,
    marginTop: 150,
    marginLeft: 150,
  },
  img: {
    width: 220,
    height: 270,
  },
});

export default SliderScreenComponent;
