import { User } from './modelTypes';

export type LoginValues = {
  email: string;
  password: string;
};

export type StartChatRequest = {
  user1Id: number;
  user2Id: number;
};

export type SendMessageRequest = {
  conversationId: number;
  senderId: number;
  content: string;
};

export type AddReactionRequest = {
  messageId: number;
  userId: number;
  emoji: string;
};

export type ReplyToMessageRequest = {
  conversationId: number;
  senderId: number;
  content: string;
  replyToMessageId: number;
};

export type UpdateUserPayload = Partial<User>;
