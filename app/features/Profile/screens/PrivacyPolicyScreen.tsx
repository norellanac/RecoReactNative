import React from 'react';
import { ScrollView } from 'react-native';
import { Text } from '@/app/components/atoms';
import { Screen } from '@/app/components/templates';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

export const PrivacyPolicyScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  return (
    <Screen
      statusBarProps={{
        showBackButton: true,
        onLeftIconPress: () => navigation.goBack(),
      }}
    >
      <ScrollView contentContainerStyle={{ padding: 24, marginBottom: 100 }}>
        <Text
          variant="title"
          size="large"
          color="primary"
          style={{ marginBottom: 16, fontWeight: 'bold' }}
        >
          {t('privacyPolicy.intro', 'Welcome to our Privacy Policy')}
        </Text>
        <Text
          variant="body"
          size="medium"
          color="secondary"
          style={{ marginBottom: 16 }}
        >
          {t('privacyPolicy.content', 'Privacy policy content...')}
        </Text>
      </ScrollView>
    </Screen>
  );
};
