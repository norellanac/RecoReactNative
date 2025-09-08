import React from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Text } from '../../../components/atoms/Text';
import { Screen } from '../../../components/templates';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useGetChatsByUserIdQuery } from '@/app/services/chatApi';
import { Avatar } from '@/app/components/molecules/Avatar';
import { Icon } from '@/app/components/atoms/Icon';

const ChatListScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const currentUser = useSelector((state) => state.auth.user);
  const currentUserId = currentUser?.id;

  const {
    data: conversationsResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetChatsByUserIdQuery(currentUserId, {
    skip: !currentUserId,
  });

  // ✅ Mejor validación de datos
  const conversations = conversationsResponse?.data || [];
  const isValidConversations =
    Array.isArray(conversations) && conversations.length > 0;

  // 🔄 Funciones para transformar datos de API a formato UI
  const getOtherUser = (conversation, currentUserId) => {
    if (!conversation || !currentUserId) return null;

    try {
      return conversation.user1Id === currentUserId
        ? conversation.user2
        : conversation.user1;
    } catch (error) {
      return null;
    }
  };

  const getLastMessage = (conversation) => {
    try {
      if (!conversation?.messages || conversation.messages.length === 0) {
        return t('chat.noMessages', 'No messages yet');
      }
      return (
        conversation.messages[conversation.messages.length - 1]?.content ||
        t('chat.noMessages', 'No messages yet')
      );
    } catch (error) {
      return t('chat.noMessages', 'No messages yet');
    }
  };

  const formatTime = (dateString) => {
    try {
      if (!dateString) return '';

      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      if (diffHours < 1) {
        return date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
      } else if (diffHours < 24) {
        return date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
      } else {
        return t('chat.yesterday', 'Yesterday');
      }
    } catch (error) {
      return '';
    }
  };

  // 🔄 Transformar datos de API al formato que espera la UI
  const transformToUIFormat = (conversations) => {
    try {
      // ✅ Validación mejorada
      if (!Array.isArray(conversations) || conversations.length === 0) {
        console.log('No conversations to transform');
        return [];
      }

      return conversations
        .map((conversation) => {
          try {
            const otherUser = getOtherUser(conversation, currentUserId);

            // ✅ Validar que otherUser existe
            if (!otherUser) {
              console.warn(
                'No other user found for conversation:',
                conversation.id,
              );
              return null;
            }

            const lastMessage = getLastMessage(conversation);
            const lastMessageTime =
              conversation.messages && conversation.messages.length > 0
                ? formatTime(
                    conversation.messages[conversation.messages.length - 1]
                      ?.createdAt,
                  )
                : '';

            return {
              id: conversation.id.toString(),
              user: {
                name: `${otherUser.name || ''} ${otherUser.lastname || ''}`.trim(),
                avatarUrl: otherUser.avatarUrl,
                firstName: otherUser.name || '',
                lastName: otherUser.lastname || '',
              },
              lastMessage: {
                text: lastMessage,
                timestamp: lastMessageTime,
              },
              unreadCount: 0, // TODO: Implementar lógica de no leídos
              isOnline: false, // TODO: Implementar estado online
            };
          } catch (error) {
            console.error(
              'Error transforming conversation:',
              conversation.id,
              error,
            );
            return null;
          }
        })
        .filter(Boolean); // ✅ Filtrar elementos null/undefined
    } catch (error) {
      console.error('Error in transformToUIFormat:', error);
      return [];
    }
  };

  // 📱 UI Components
  const ChatItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => {
        try {
          const originalConversation = conversations.find(
            (c) => c.id.toString() === item.id,
          );

          if (!originalConversation) {
            console.error('Original conversation not found');
            return;
          }

          const otherUser = getOtherUser(originalConversation, currentUserId);

          if (!otherUser) {
            console.error('Other user not found');
            return;
          }

          navigation.navigate('ChatScreen', {
            conversationId: parseInt(item.id),
            otherUser: {
              id: otherUser.id,
              name: otherUser.name || '',
              lastname: otherUser.lastname || '',
              avatarUrl: otherUser.avatarUrl,
            },
          });
        } catch (error) {
          console.error('Error navigating to chat:', error);
        }
      }}
    >
      <View style={styles.avatarContainer}>
        <Avatar
          avatarUrl={item.user.avatarUrl}
          name={item.user.firstName}
          lastname={item.user.lastName}
          size={50}
        />
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.messageContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.userName}>{item.user.name}</Text>
          <Text style={styles.timestamp}>{item.lastMessage.timestamp}</Text>
        </View>

        <View style={styles.messageRow}>
          <Text
            style={[
              styles.lastMessage,
              item.unreadCount > 0 && styles.unreadMessage,
            ]}
            numberOfLines={1}
          >
            {item.lastMessage.text}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>
                {item.unreadCount > 9 ? '9+' : item.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  // ✅ Validar si hay error o no hay userId
  if (!currentUserId) {
    return (
      <Screen
        statusBarProps={{
          showBackButton: true,
          title: (
            <Text
              variant="title"
              size="medium"
              color="info"
              style={styles.headerTitle}
            >
              {t('messages.title', 'Messages')}
            </Text>
          ),
        }}
      >
        <View style={[styles.container, styles.centerContainer]}>
          <Text style={styles.errorText}>
            {t('chat.userNotFound', 'User not found')}
          </Text>
        </View>
      </Screen>
    );
  }

  // 🔄 Estados de carga y error
  if (isLoading) {
    return (
      <Screen
        statusBarProps={{
          showBackButton: true,
          title: (
            <Text
              variant="title"
              size="medium"
              color="info"
              style={styles.headerTitle}
            >
              {t('messages.title', 'Messages')}
            </Text>
          ),
        }}
      >
        <View style={[styles.container, styles.centerContainer]}>
          <ActivityIndicator size="large" color="#7B61FF" />
          <Text style={styles.loadingText}>
            {t('chat.loading', 'Loading conversations...')}
          </Text>
        </View>
      </Screen>
    );
  }

  if (isError) {
    console.error('ChatListScreen Error:', error);
    return (
      <Screen
        statusBarProps={{
          showBackButton: true,
          title: (
            <Text
              variant="title"
              size="medium"
              color="info"
              style={styles.headerTitle}
            >
              {t('messages.title', 'Messages')}
            </Text>
          ),
        }}
      >
        <View style={[styles.container, styles.centerContainer]}>
          <Text style={styles.errorText}>
            {t('chat.error', 'Error loading conversations')}
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

  // ✅ Transformar datos y renderizar
  const uiData = transformToUIFormat(conversations);

  return (
    <Screen
      statusBarProps={{
        showBackButton: true,
        title: (
          <Text
            variant="title"
            size="medium"
            color="info"
            style={styles.headerTitle}
          >
            {t('messages.title', 'Messages')}
          </Text>
        ),
      }}
    >
      <View style={styles.container}>
        <FlatList
          data={uiData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatItem item={item} />}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshing={isLoading}
          onRefresh={refetch}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Icon name="emoji-sad" size={56} color="#999" family="Entypo" />
              <Text style={styles.emptyTitleText}>
                {t(
                  'chat.noConversationsTitle',
                  'No hay conversaciones todavía',
                )}
              </Text>
              <Text style={styles.emptyDescriptionText}>
                {t(
                  'chat.noConversationsDescription',
                  'Explora servicios y crea una nueva tarea. Una vez confirmada, podrás chatear con tu proveedor asignado.',
                )}
              </Text>
            </View>
          }
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
    minHeight: 600,
  },
  emptyTitleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  emptyDescriptionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  headerTitle: {
    marginTop: 12,
  },
  chatItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    marginRight: 8,
  },
  unreadMessage: {
    fontWeight: '600',
    color: '#333',
  },
  unreadBadge: {
    backgroundColor: '#7B61FF',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 78,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
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
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default ChatListScreen;
