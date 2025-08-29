import React from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Text } from '../../../components/atoms/Text';
import { Screen } from '../../../components/templates';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store/store';
import { useGetChatsByUserIdQuery } from '@/app/services/chatApi';
import { ChatConversation, User } from '@/app/types/api/modelTypes';
import { getApiImageUrl } from '@/app/utils/Environment';

// ✅ Mantener la misma interfaz UI, pero adaptada a los datos reales
interface ChatListItem {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  lastMessage: {
    text: string;
    timestamp: string;
  };
  unreadCount: number;
  isOnline?: boolean;
}

const ChatListScreen = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  // 🔌 Conectar con Redux y API
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const currentUserId = currentUser?.id;

  const {
    data: conversationsResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetChatsByUserIdQuery(currentUserId!, {
    // ← Cambiar hook
    skip: !currentUserId,
  });

  const conversations = conversationsResponse?.data || [];

  // 🔄 Funciones para transformar datos de API a formato UI
  const getOtherUser = (
    conversation: ChatConversation,
    currentUserId: number,
  ): User => {
    return conversation.user1Id === currentUserId
      ? conversation.user2
      : conversation.user1;
  };

  const getLastMessage = (conversation: ChatConversation): string => {
    if (conversation.messages.length === 0)
      return t('chat.noMessages', 'No messages yet');
    return conversation.messages[conversation.messages.length - 1].content;
  };

  const formatTime = (dateString: string): string => {
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
  };

  // 🔄 Transformar datos de API al formato que espera la UI
  const transformToUIFormat = (
    conversations: ChatConversation[],
  ): ChatListItem[] => {
    if (!Array.isArray(conversations)) {
      return [];
    }
    return conversations.map((conversation, index) => {
      const otherUser = getOtherUser(conversation, currentUserId!);
      const lastMessage = getLastMessage(conversation);
      const lastMessageTime =
        conversation.messages.length > 0
          ? formatTime(
              conversation.messages[conversation.messages.length - 1].createdAt,
            )
          : '';

      return {
        id: conversation.id.toString(),
        user: {
          name: `${otherUser.name} ${otherUser.lastname}`,
          avatar: otherUser.avatarUrl
            ? getApiImageUrl(otherUser.avatarUrl).uri
            : 'https://via.placeholder.com/50/CCCCCC/FFFFFF?text=User',
        },
        lastMessage: {
          text: lastMessage,
          timestamp: lastMessageTime,
        },
        unreadCount: 0, // TODO: Implementar lógica de no leídos
        isOnline: false, // TODO: Implementar estado online
      };
    });
  };

  // 📱 UI Components - MANTENER EXACTAMENTE IGUAL
  const ChatItem: React.FC<{ item: ChatListItem }> = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => {
        // ✅ Navegación actualizada con datos reales
        const originalConversation = conversations.find(
          (c) => c.id.toString() === item.id,
        );
        const otherUser = getOtherUser(originalConversation!, currentUserId!);

        navigation.navigate('ChatScreen', {
          conversationId: parseInt(item.id),
          otherUser: {
            id: otherUser.id,
            name: otherUser.name,
            lastname: otherUser.lastname,
            avatarUrl: otherUser.avatarUrl,
          },
        });
      }}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
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

  // ✅ Transformar datos y renderizar - UI EXACTAMENTE IGUAL
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
        <FlatList<ChatListItem>
          data={uiData} // ✅ Usar datos transformados
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatItem item={item} />}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshing={isLoading}
          onRefresh={refetch}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>
                {t('chat.noConversations', 'No conversations yet')}
              </Text>
            </View>
          }
        />
      </View>
    </Screen>
  );
};

// ✅ Estilos EXACTAMENTE IGUALES + algunos nuevos para estados
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 16,
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
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
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
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
  // ✅ Nuevos estilos para estados
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
