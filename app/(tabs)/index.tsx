import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  useColorScheme,
  Button,
  View,
} from 'react-native';
import { setI18nConfig, translate } from "../../src/helpers/i18n";

import { Colors } from 'react-native/Libraries/NewAppScreen';


export default function HomeScreen() {
  const [statusLenguage, setStatusLenguage] = useState<string>('es');
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  setI18nConfig(statusLenguage);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={{ alignItems: 'center', margin: 90 }}>
        <Text>{translate('commons.begin')} NERY</Text>
        <Button title='AQUI' />
      </View>
    </SafeAreaView>
  );
}