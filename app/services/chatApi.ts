import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithReauth from './baseQueryWithReauth';

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getChatsByUserId: builder.query({
      query: (id) => `chat/conversations/user/${id}`,
    }),
    getChatById: builder.query({
      query: (id) => `chat/messages/${id}/`,
    }),
    createChat: builder.mutation({
      query: (chatData) => ({
        url: 'chat/conversation/',
        method: 'POST',
        body: chatData,
      }),
    }),
    updateChat: builder.mutation({
      query: ({ chatId, chatData }) => ({
        url: `chats/${chatId}`,
        method: 'PUT',
        body: chatData,
      }),
    }),
    sendMessage: builder.mutation({
      query: (messageData) => ({
        url: 'chat/message', // Endpoint para enviar mensajes
        method: 'POST',
        body: messageData,
      }),
    }),
  }),
});

export const {
  useGetChatByIdQuery,
  useGetChatsByUserIdQuery,
  useCreateChatMutation,
  useUpdateChatMutation,
  useSendMessageMutation,
} = chatApi;
