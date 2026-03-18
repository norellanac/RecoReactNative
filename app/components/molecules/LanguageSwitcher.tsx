import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import './../../helpers/i18n';
import { Button } from '../atoms';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <View style={styles.container}>
      <Button
        variant={i18n.language === 'en' ? 'filled' : 'elevated'}
        title="English"
        onPress={() => changeLanguage('en')}
        style={[styles.button]}
      />
      <Button
        variant={i18n.language === 'es' ? 'filled' : 'elevated'}
        title="Español"
        onPress={() => changeLanguage('es')}
        style={[styles.button]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  button: {
    marginHorizontal: 5,
  },
});

export default LanguageSwitcher;
