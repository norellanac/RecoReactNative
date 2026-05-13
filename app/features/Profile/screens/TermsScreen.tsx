import React from 'react';
import { ScrollView } from 'react-native';
import { Text } from '@/app/components/atoms';
import { Screen } from '@/app/components/templates';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useBranding } from '@/app/hooks/useBranding';

export const TermsScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { config } = useBranding();

  const appName = config?.appName || 'Reco';

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
          {t('terms.title', `Terms and Conditions for ${appName}`)}
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
