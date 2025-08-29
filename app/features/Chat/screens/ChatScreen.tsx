import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Text } from 'react-native';
import { Screen } from '../../../components/templates';
import { Icon } from '../../../components/atoms/Icon';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store/store';
import {
  useGetChatByIdQuery,
  useSendMessageMutation,
} from '@/app/services/chatApi';
import { ChatMessage as APIChatMessage } from '@/app/types/api/modelTypes';
import { getApiImageUrl } from '@/app/utils/Environment';

// ✅ Mantener la misma interfaz UI
interface ChatMessage {
  id: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
  status?: 'sent' | 'delivered' | 'read';
}

// Tipos para navegación
interface RouteParams {
  conversationId: number;
  otherUser: {
    id: number;
    name: string;
    lastname: string;
    avatarUrl: string | null;
  };
}

const ChatScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { t } = useTranslation();
  const { conversationId, otherUser } = route.params as RouteParams;

  // 🔌 Conectar con Redux y API
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const currentUserId = currentUser?.id;

  const {
    data: conversationResponse,
    isLoading,
    isError,
    refetch,
  } = useGetChatByIdQuery(conversationId);

  const [sendMessageMutation, { isLoading: isSending }] =
    useSendMessageMutation();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');

  // 🔄 Transformar datos de API al formato UI
  const transformMessagesToUI = (
    apiMessages: APIChatMessage[],
  ): ChatMessage[] => {
    return apiMessages.map((msg) => ({
      id: msg.id.toString(),
      text: msg.content,
      timestamp: formatMessageTime(msg.createdAt),
      isOwn: msg.senderId === currentUserId,
      status: 'read', // TODO: Implementar estados reales si la API los soporta
    }));
  };

  const formatMessageTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  // ✅ Actualizar mensajes cuando lleguen datos de la API
  useEffect(() => {
    if (conversationResponse?.data?.messages) {
      const uiMessages = transformMessagesToUI(
        conversationResponse.data.messages,
      );
      setMessages(uiMessages);
    }
  }, [conversationResponse]);

  // 📤 Enviar mensaje con API real
  const sendMessage = async () => {
    if (!inputText.trim() || !currentUserId) return;

    // ✅ Agregar mensaje optimistamente (UI responsiva)
    const tempMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      text: inputText,
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      isOwn: true,
      status: 'sent',
    };

    setMessages((prev) => [...prev, tempMessage]);
    const messageToSend = inputText;
    setInputText('');

    try {
      // 📡 Enviar a la API
      await sendMessageMutation({
        conversationId,
        senderId: currentUserId,
        content: messageToSend,
      }).unwrap();

      // ✅ Refrescar mensajes para obtener el mensaje real del servidor
      refetch();
    } catch (error) {
      // ❌ Si falla, revertir UI y mostrar error
      setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
      setInputText(messageToSend); // Restaurar texto
      console.error('Error sending message:', error);
      // TODO: Mostrar toast de error
    }
  };

  // 📱 UI Components - MANTENER EXACTAMENTE IGUAL
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

  // 🔄 Estados de carga y error
  if (isLoading) {
    return (
      <Screen
        statusBarProps={{
          showBackButton: true,
          title: (
            <View style={styles.headerContainer}>
              <View style={[styles.headerAvatar, styles.loadingAvatar]} />
              <View>
                <Text style={styles.headerName}>Loading...</Text>
              </View>
            </View>
          ),
          onLeftIconPress: () => navigation.goBack(),
        }}
      >
        <View style={[styles.container, styles.centerContainer]}>
          <ActivityIndicator size="large" color="#7B61FF" />
        </View>
      </Screen>
    );
  }

  if (isError) {
    return (
      <Screen
        statusBarProps={{
          showBackButton: true,
          title: <Text style={styles.headerName}>Error</Text>,
          onLeftIconPress: () => navigation.goBack(),
        }}
      >
        <View style={[styles.container, styles.centerContainer]}>
          <Text style={styles.errorText}>
            {t('chat.errorLoadingMessages', 'Error loading messages')}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetch()}
          >
            <Text style={styles.retryText}>{t('common.retry', 'Retry')}</Text>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  // ✅ Obtener URL de avatar
  const getAvatarSource = () => {
    if (otherUser.avatarUrl) {
      return getApiImageUrl(otherUser.avatarUrl);
    }
    return { uri: 'https://via.placeholder.com/32/CCCCCC/FFFFFF?text=User' };
  };

  return (
    <Screen
      statusBarProps={{
        showBackButton: true,
        title: (
          <View style={styles.headerContainer}>
            <Image source={getAvatarSource()} style={styles.headerAvatar} />
            <View>
              <Text style={styles.headerName}>
                {`${otherUser.name} ${otherUser.lastname}`}
              </Text>
              <Text style={styles.headerStatus}>
                {t('chat.online', 'Online')}
              </Text>
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
          onContentSizeChange={() => {
            // Auto scroll to bottom when new messages arrive
          }}
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
              editable={!isSending}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                {
                  opacity: inputText.trim() && !isSending ? 1 : 0.5,
                },
              ]}
              onPress={sendMessage}
              disabled={!inputText.trim() || isSending}
            >
              {isSending ? (
                <ActivityIndicator size={20} color="#fff" />
              ) : (
                <Icon
                  name="send"
                  family="MaterialIcons"
                  size={24}
                  color="#fff"
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
};

// ✅ Estilos EXACTAMENTE IGUALES + algunos nuevos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
  loadingAvatar: {
    backgroundColor: '#f0f0f0',
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
  // ✅ Nuevos estilos para estados
  errorText: {
    fontSize: 16,
    color: '#FF4757',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#7B61FF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ChatScreen;
