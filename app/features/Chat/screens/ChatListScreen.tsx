import React from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { Text } from '../../../components/atoms/Text';
import { Screen } from '../../../components/templates';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

// Tipo para las conversaciones
interface ChatConversation {
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

// Datos de ejemplo (después conectarás con tu API)
const mockConversations: ChatConversation[] = [
  {
    id: '1',
    user: {
      name: 'Jenny Wilson',
      avatar: 'https://picsum.photos/50/50',
    },
    lastMessage: { text: 'I have booked your house...', timestamp: '13:29' },
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: '2',
    user: {
      name: 'Alfonzo Schuessler',
      avatar: 'https://picsum.photos/40/40',
    },
    lastMessage: { text: 'I just finished it 😂😂', timestamp: '10:48' },
    unreadCount: 3,
    isOnline: false,
  },
  {
    id: '3',
    user: {
      name: 'Benny Spanbauer',
      avatar: 'https://picsum.photos/60/60',
    },
    lastMessage: { text: 'omg, this is amazing 🔥🔥🔥', timestamp: '09:25' },
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: '4',
    user: {
      name: 'Marci Senter',
      avatar: 'https://picsum.photos/55/55',
    },
    lastMessage: {
      text: 'Wow, this is really epic 😎',
      timestamp: 'Yesterday',
    },
    unreadCount: 2,
    isOnline: false,
  },
];

const ChatListScreen = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  const ChatItem: React.FC<{ item: ChatConversation }> = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() =>
        navigation.navigate('ChatScreen', {
          chatId: item.id,
          userName: item.user.name,
          userAvatar: item.user.avatar,
        })
      }
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
        <FlatList<ChatConversation>
          data={mockConversations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatItem item={item} />}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
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
});

export default ChatListScreen;
