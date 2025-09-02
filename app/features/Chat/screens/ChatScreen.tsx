import React, { useState, useEffect, useRef } from 'react';
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
  Animated,
  Modal,
  Dimensions,
} from 'react-native';
import { Text } from 'react-native';
import { Screen } from '../../../components/templates';
import { Icon } from '../../../components/atoms/Icon';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  useGetChatByIdQuery,
  useSendMessageMutation,
  useAddReactionMutation,
} from '@/app/services/chatApi';
import { getApiImageUrl } from '@/app/utils/Environment';

const REACTIONS = [
  { type: 'like', emoji: '👍' },
  { type: 'love', emoji: '❤️' },
  { type: 'laugh', emoji: '😂' },
  { type: 'wow', emoji: '😮' },
  { type: 'sad', emoji: '😢' },
];

const ChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { t } = useTranslation();
  const { conversationId, otherUser } = route.params || {};

  if (!conversationId || !otherUser) {
    console.error('Missing required parameters: conversationId or otherUser.');
    return (
      <Screen>
        <Text style={{ textAlign: 'center', marginTop: 40 }}>
          Missing required parameters.
        </Text>
      </Screen>
    );
  }

  const currentUser = useSelector((state) => state.auth.user);
  const currentUserId = currentUser?.id;

  const {
    data: conversationResponse,
    isLoading,
    isError,
    refetch,
  } = useGetChatByIdQuery(conversationId);

  const [sendMessageMutation, { isLoading: isSending }] =
    useSendMessageMutation();
  const [addReaction, { isLoading: isReacting }] = useAddReactionMutation();

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  // Estados para el menú de reacciones
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [reactionPosition, setReactionPosition] = useState({ x: 0, y: 0 });
  const scaleAnim = useRef(new Animated.Value(0)).current;

  // Transformar datos de API al formato UI
  const transformMessagesToUI = (apiMessages) => {
    return apiMessages.map((msg) => ({
      id: msg.id.toString(),
      text: msg.content,
      timestamp: formatMessageTime(msg.createdAt),
      isOwn: msg.senderId === currentUserId,
      status: 'read',
      reactions: msg.Reactions || [], // Agregar reacciones del mensaje
    }));
  };

  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  useEffect(() => {
    if (conversationResponse?.data?.messages) {
      const uiMessages = transformMessagesToUI(
        conversationResponse.data.messages,
      );
      setMessages(uiMessages);
    }
  }, [conversationResponse]);

  // Obtener dimensiones de la pantalla
  const { width: screenWidth } = Dimensions.get('window');
  const REACTION_PICKER_WIDTH = 280; // Ancho aproximado del menú de reacciones

  // Función mejorada para manejar long press en mensajes
  const handleLongPress = (messageId, event) => {
    const { pageX, pageY } = event.nativeEvent;
    setSelectedMessageId(messageId);

    // Calcular posición X mejorada
    let calculatedX = pageX - REACTION_PICKER_WIDTH / 2; // Centrar el menú horizontalmente

    // Verificar si se sale por la izquierda
    if (calculatedX < 16) {
      calculatedX = 16;
    }

    // Verificar si se sale por la derecha
    if (calculatedX + REACTION_PICKER_WIDTH > screenWidth - 16) {
      calculatedX = screenWidth - REACTION_PICKER_WIDTH - 16;
    }

    setReactionPosition({
      x: calculatedX,
      y: pageY - 80, // Aumentar un poco la distancia vertical
    });
    setShowReactionPicker(true);

    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 150,
      friction: 8,
    }).start();
  };

  // Función para cerrar el menú de reacciones
  const closeReactionPicker = () => {
    Animated.spring(scaleAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 150,
      friction: 8,
    }).start(() => {
      setShowReactionPicker(false);
      setSelectedMessageId(null);
    });
  };

  // Función para manejar selección de reacción
  const handleReactionSelect = async (reactionType) => {
    if (!selectedMessageId) return;

    try {
      await addReaction({
        userId: currentUserId,
        reactableType: 'message',
        reactableId: parseInt(selectedMessageId),
        type: reactionType,
      }).unwrap();

      refetch(); // Refrescar para obtener las reacciones actualizadas
      closeReactionPicker();
    } catch (error) {
      console.error('Error adding reaction:', error);
      closeReactionPicker();
    }
  };

  // Enviar mensaje
  const sendMessage = async () => {
    if (!inputText.trim() || !currentUserId) return;

    const tempMessage = {
      id: `temp-${Date.now()}`,
      text: inputText,
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      isOwn: true,
      status: 'sent',
      reactions: [],
    };

    setMessages((prev) => [...prev, tempMessage]);
    const messageToSend = inputText;
    setInputText('');

    try {
      await sendMessageMutation({
        conversationId,
        senderId: currentUserId,
        content: messageToSend,
      }).unwrap();

      refetch();
    } catch (error) {
      setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
      setInputText(messageToSend);
      console.error('Error sending message:', error);
    }
  };

  // Componente para mostrar reacciones en el mensaje
  const MessageReactions = ({ reactions }) => {
    if (!reactions || reactions.length === 0) return null;

    // Agrupar reacciones por tipo
    const groupedReactions = reactions.reduce((acc, reaction) => {
      if (!acc[reaction.type]) {
        acc[reaction.type] = 0;
      }
      acc[reaction.type]++;
      return acc;
    }, {});

    return (
      <View style={styles.messageReactions}>
        {Object.entries(groupedReactions).map(([type, count]) => {
          const reactionEmoji =
            REACTIONS.find((r) => r.type === type)?.emoji || '👍';
          return (
            <View key={type} style={styles.reactionBadge}>
              <Text style={styles.reactionEmojiSmall}>{reactionEmoji}</Text>
              {count > 1 && <Text style={styles.reactionCount}>{count}</Text>}
            </View>
          );
        })}
      </View>
    );
  };

  // Componente MessageItem actualizado
  const MessageItem = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.isOwn ? styles.ownMessage : styles.otherMessage,
      ]}
    >
      <TouchableOpacity
        onLongPress={(event) => handleLongPress(item.id, event)}
        activeOpacity={0.8}
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

        <MessageReactions reactions={item.reactions} />
      </TouchableOpacity>

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

  // Estados de carga y error
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

  const getAvatarSource = () => {
    if (otherUser.avatarUrl) {
      return getApiImageUrl(otherUser.avatarUrl);
    }
    return { uri: 'https://via.placeholder.com/32/CCCCCC/FFFFFF?text=User' };
  };

  return (
    <>
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
          <FlatList
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

      {/* Modal fuera del componente Screen */}
      <Modal
        transparent
        visible={showReactionPicker}
        onRequestClose={closeReactionPicker}
        animationType="none"
      >
        <TouchableOpacity
          style={styles.reactionOverlay}
          activeOpacity={1}
          onPress={closeReactionPicker}
        >
          <Animated.View
            style={[
              styles.reactionPicker,
              {
                left: reactionPosition.x, // Usar la posición calculada directamente
                top: Math.max(60, reactionPosition.y), // Mantener el límite superior
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {REACTIONS.map((reaction) => (
              <TouchableOpacity
                key={reaction.type}
                style={styles.reactionButton}
                onPress={() => handleReactionSelect(reaction.type)}
              >
                <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

// Estilos (sin cambios)
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
  // Estilos para reacciones
  reactionOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  reactionPicker: {
    position: 'absolute',
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 8,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  reactionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 2,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  reactionEmoji: {
    fontSize: 24,
  },
  messageReactions: {
    flexDirection: 'row',
    marginTop: 4,
    flexWrap: 'wrap',
  },
  reactionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    paddingHorizontal: 6,
    paddingVertical: 6,
    marginRight: 4,
    marginTop: -6,
  },
  reactionEmojiSmall: {
    fontSize: 14,
  },
  reactionCount: {
    fontSize: 12,
    color: '#666',
    marginLeft: 2,
    fontWeight: '500',
  },
});

export default ChatScreen;
