import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '../../../components/templates';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ChatStackParams } from './types';
import { useTranslation } from 'react-i18next';

type ChatScreenRouteProp = RouteProp<ChatStackParams, 'ChatScreen'>;

const ChatScreen = () => {
  const route = useRoute<ChatScreenRouteProp>();
  const { chatId } = route.params;
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
            {t('messages.conversation', 'Conversation with {{chatId}}', {
              chatId,
            })}
          </Text>
        ),
      }}
    >
      <View style={styles.container}>
        <Text style={styles.text}>Chat ID: {chatId}</Text>
        <Text style={styles.text}>Aquí irá la conversación</Text>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    color: '#333',
    marginBottom: 20,
  },
});

export default ChatScreen;
