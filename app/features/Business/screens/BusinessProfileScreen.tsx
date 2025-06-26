import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../../../components/atoms';
import { Screen } from '../../../components/templates';
import Tabs from '@/app/components/molecules/Tabs';
import MyServices from '@/app/features/Business/screens/MyServices';
import { BusinessStepperScreen } from '@/app/features/Business/screens/BusinessStepperScreen';
import { useTranslation } from 'react-i18next';

export const BusinessProfileScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);

  const switchToRegisterTab = () => {
    setActiveTab(0);
  };

  const tabs = [
    {
      title: t('business.tabs.register', 'Register new service'),
      render: () => <BusinessStepperScreen navigation={navigation} />,
    },
    {
      title: t('business.tabs.myServices', 'My services'),
      render: () => (
        <MyServices
          navigation={navigation}
          onRegisterService={switchToRegisterTab}
        />
      ),
    },
  ];

  return (
    <Screen
      statusBarProps={{
        showBackButton: true,
        title: (
          <Text
            variant="headline"
            size="small"
            color="info"
            style={{ marginTop: 8 }}
          >
            {t('business.title', 'My Services')}
          </Text>
        ),
        onLeftIconPress: () => navigation.goBack(),
      }}
    >
      <View style={styles.container}>
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8FF',
  },
});

export default BusinessProfileScreen;
