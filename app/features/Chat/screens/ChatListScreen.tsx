import React from 'react';
import { Screen } from '../../../components/templates';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from '../../../components/atoms';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const ChatListScreen = () => {
  const navigation = useNavigation();
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
            {t('messages.title', 'Messages')}
          </Text>
        ),
      }}
    >
      <View style={styles.container}>
        <Text style={styles.text}>Lista de chats</Text>
        {/* Ejemplo de navegación a un chat específico */}
        <Button
          title="Ir a chat de ejemplo"
          onPress={() => navigation.navigate('ChatScreen', { chatId: 'demo' })}
        />
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

export default ChatListScreen;
