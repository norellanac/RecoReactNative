import React from 'react';
import { Screen } from '../../../components/templates';
import { Text } from '../../../components/atoms';
import OrdersScreen from './OrdersScreen';
import { useTranslation } from 'react-i18next';

export const TaskPage = ({ navigation }: Props) => {
  const { t } = useTranslation();
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
            {t('task.title', 'Tasks')}
          </Text>
        ),
        onLeftIconPress: () => navigation.goBack(),
      }}
    >
      <OrdersScreen />
    </Screen>
  );
};
