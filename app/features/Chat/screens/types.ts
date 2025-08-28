import { ChatConversation, ChatMessage } from '@/app/types/api/modelTypes';

// Tipos para navegación (solo frontend)
export type ChatStackParams = {
  ChatList: undefined;
  ChatScreen: {
    conversationId: number;
    participant: {
      id: number;
      name: string;
      lastname: string;
      avatarUrl: string | null;
    };
  };
};

// Tipos para UI local (transformados para la interfaz)
export interface ChatListItem {
  conversation: ChatConversation;
  otherParticipant: {
    id: number;
    fullName: string;
    avatar: string;
    isOnline: boolean;
  };
  lastMessagePreview: string;
  formattedTime: string;
}

export interface ChatMessageItem extends ChatMessage {
  isOwn: boolean;
  formattedTime: string;
  showAvatar: boolean;
}