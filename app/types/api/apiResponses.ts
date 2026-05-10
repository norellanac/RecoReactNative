import { User } from './modelTypes';
import { ChatConversation, ChatMessage, ChatStartResponse } from './modelTypes';

export type UserResponseType = {
  success: boolean;
  message: string;
  data: User;
};

export type LoginResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export type SuccessResponseType<T> = {
  success: true;
  statusCode: number;
  message: string;
  data: T;
};

export type ErrorResponseType = {
  success: false;
  statusCode: number;
  message: string;
  error: string;
};

export type ChatConversationResponse = SuccessResponseType<ChatConversation>;
export type ChatConversationsListResponse = SuccessResponseType<ChatConversation[]>;
export type StartChatResponse = SuccessResponseType<ChatStartResponse>;
export type SendMessageResponse = SuccessResponseType<ChatMessage>;

export type ApiResponseType<T> = SuccessResponseType<T> | ErrorResponseType;