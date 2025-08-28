import React, { useState } from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Text } from 'react-native';
import { Screen } from '../../../components/templates';
import { Icon } from '../../../components/atoms/Icon';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

// Tipo para los mensajes
interface ChatMessage {
  id: string;
  text: string;
  timestamp: string;
  isOwn: boolean; // true si es del usuario actual
  status?: 'sent' | 'delivered' | 'read';
}

// Datos de ejemplo
const mockMessages: ChatMessage[] = [
  {
    id: '1',
    text: 'Hi! I saw your house cleaning service.',
    timestamp: '10:30',
    isOwn: false,
  },
  {
    id: '2',
    text: 'Hello! Yes, I can help you with that. When would you like to schedule?',
    timestamp: '10:32',
    isOwn: true,
    status: 'read',
  },
  {
    id: '3',
    text: 'I have booked your house cleaning for tomorrow. What time works best?',
    timestamp: '10:35',
    isOwn: false,
  },
  {
    id: '4',
    text: 'Perfect! How about 2:00 PM? I can be there at that time.',
    timestamp: '10:40',
    isOwn: true,
    status: 'delivered',
  },
];

const ChatScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { t } = useTranslation();
  const { chatId, userName, userAvatar } = route.params;

  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        text: inputText,
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
        isOwn: true,
        status: 'sent',
      };

      setMessages((prev) => [...prev, newMessage]);
      setInputText('');
    }
  };

  const MessageItem: React.FC<{ item: ChatMessage }> = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.isOwn ? styles.ownMessage : styles.otherMessage,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          item.isOwn ? styles.ownBubble : styles.otherBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            item.isOwn ? styles.ownText : styles.otherText,
          ]}
        >
          {item.text}
        </Text>
      </View>

      <View
        style={[
          styles.messageInfo,
          item.isOwn ? styles.ownInfo : styles.otherInfo,
        ]}
      >
        <Text style={styles.timestamp}>{item.timestamp}</Text>
        {item.isOwn && (
          <Icon
            name={
              item.status === 'read'
                ? 'done-all'
                : item.status === 'delivered'
                  ? 'done-all'
                  : 'done'
            }
            family="MaterialIcons"
            size={16}
            color={item.status === 'read' ? '#4CAF50' : '#999'}
          />
        )}
      </View>
    </View>
  );

  return (
    <Screen
      statusBarProps={{
        showBackButton: true,
        title: (
          <View style={styles.headerContainer}>
            <Image source={{ uri: userAvatar }} style={styles.headerAvatar} />
            <View>
              <Text style={styles.headerName}>{userName}</Text>
              <Text style={styles.headerStatus}>Online</Text>
            </View>
          </View>
        ),
        onLeftIconPress: () => navigation.goBack(),
      }}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <FlatList<ChatMessage>
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MessageItem item={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesList}
          inverted={false}
        />

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder={t('chat.placeholder', 'Type a message...')}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                { opacity: inputText.trim() ? 1 : 0.5 },
              ]}
              onPress={sendMessage}
              disabled={!inputText.trim()}
            >
              <Icon name="send" family="MaterialIcons" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  headerStatus: {
    fontSize: 12,
    color: '#4CAF50',
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageContainer: {
    marginVertical: 4,
  },
  ownMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
  },
  ownBubble: {
    backgroundColor: '#7B61FF',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  ownText: {
    color: '#fff',
  },
  otherText: {
    color: '#333',
  },
  messageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    paddingHorizontal: 4,
  },
  ownInfo: {
    justifyContent: 'flex-end',
  },
  otherInfo: {
    justifyContent: 'flex-start',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginRight: 4,
  },
  inputContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f8f9fa',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 8,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#7B61FF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});

export default ChatScreen;
