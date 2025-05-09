import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Screen } from '../../../components/templates';
import LanguageSwitcher from '@/app/components/molecules/LanguageSwitcher';
import { Text } from '../../../components/atoms';
import { useTranslation } from 'react-i18next';

export const ChangeLanguage = ({ navigation }: { navigation: any }) => {
  const { t } = useTranslation();

  return (
    <Screen
      statusBarProps={{
        showBackButton: true,
        onLeftIconPress: () => navigation.goBack(),
      }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>
          {t('userProfile.changeLanguage', 'Change Language')}
        </Text>
        <LanguageSwitcher />
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
