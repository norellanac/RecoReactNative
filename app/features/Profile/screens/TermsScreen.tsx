import React from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from '@/app/components/atoms';
import { Screen } from '@/app/components/templates';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

export const TermsScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <Screen
      statusBarProps={{
        showBackButton: true,
        onLeftIconPress: () => navigation.goBack(),
      }}
    >
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <Text
          variant="title"
          size="large"
          color="primary"
          style={{ marginBottom: 16, fontWeight: 'bold' }}
        >
          {t(
            'terms.title',
            'Terms and Conditions for Reco (Web Platform and Mobile App)',
          )}
        </Text>
        <Text
          variant="body"
          size="medium"
          color="secondary"
          style={{ marginBottom: 16 }}
        >
          {t('terms.content', 'Terms and conditions content...')}
        </Text>
      </ScrollView>
    </Screen>
  );
};
