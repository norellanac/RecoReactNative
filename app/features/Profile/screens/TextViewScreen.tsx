import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../../../components/atoms';
import { WebView } from 'react-native-webview';
import { Screen } from '../../../components/templates';
import { useTranslation } from 'react-i18next';

interface TextViewScreenProps {
  route: {
    params: {
      url: string;
    };
  };
}

const TextViewScreen: React.FC<TextViewScreenProps> = ({ route }) => {
  const { t } = useTranslation();
  return (
    <Screen
      statusBarProps={{
        showBackButton: true,
        title: (
          <Text
            variant="title"
            size="medium"
            color="info"
            style={{ marginTop: 8 }}
          >
            {t('userProfile.legal', 'Legal Information')}
          </Text>
        ),
      }}
    >
      <View style={styles.container}>
        <WebView source={{ uri: route.params.url }} style={{ flex: 1 }} />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default TextViewScreen;
