import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Screen } from '../../../components/templates';
import LanguageSwitcher from '@/app/components/molecules/LanguageSwitcher';
import { Text } from '../../../components/atoms';
import { useTranslation } from 'react-i18next';
import LanguageIcon from '@/app/assets/img/LanguageIcon.png';

export const ChangeLanguage = ({ navigation }: { navigation: any }) => {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language); // Estado para el idioma seleccionado

  useEffect(() => {
    const handleLanguageChange = () => {
      setSelectedLanguage(i18n.language);
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  return (
    <Screen
      statusBarProps={{
        showBackButton: true,
        onLeftIconPress: () => navigation.goBack(),
      }}
    >
      <View style={styles.container}>
        <Image source={LanguageIcon} style={styles.image} />
        <Text
          variant="headline"
          size="small"
          color="secondary"
          style={styles.title}
        >
          {t('userProfile.changeLanguage', 'Change Language')}
        </Text>
        <LanguageSwitcher />
        <Text style={styles.selectedLanguageText}>
          {t('userProfile.selectedLanguage', 'You have selected:')}{' '}
          {selectedLanguage}
        </Text>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 20,
  },
  selectedLanguageText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});
