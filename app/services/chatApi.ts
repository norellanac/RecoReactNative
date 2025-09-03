import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithReauth from './baseQueryWithReauth';

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Chats', 'Messages'],
  endpoints: (builder) => ({
    getChatsByUserId: builder.query({
      query: (id) => `chat/conversations/user/${id}`,
      providesTags: (result, error, id) => [
        'Chats',
        { type: 'Chats', id: 'LIST' }, // Tag específico para la lista
      ],
    }),
    getChatById: builder.query({
      query: (id) => `chat/messages/${id}/`,
      providesTags: (result, error, id) => [
        { type: 'Messages', id },
        { type: 'Messages', id: 'LIST' }, // Tag genérico para invalidaciones masivas
      ],
    }),
    createChat: builder.mutation({
      query: (chatData) => ({
        url: 'chat/conversation/',
        method: 'POST',
        body: chatData,
      }),
      invalidatesTags: [
        'Chats',
        { type: 'Chats', id: 'LIST' }, // Invalidar la lista de chats
      ],
    }),
    updateChat: builder.mutation({
      query: ({ chatId, chatData }) => ({
        url: `chats/${chatId}`,
        method: 'PUT',
        body: chatData,
      }),
      invalidatesTags: (result, error, { chatId }) => [
        { type: 'Messages', id: chatId },
        'Chats', // También invalidar la lista de chats por si cambió el último mensaje
      ],
    }),
    sendMessage: builder.mutation({
      query: (messageData) => ({
        url: 'chat/message',
        method: 'POST',
        body: messageData,
      }),
      invalidatesTags: (result, error, { conversationId }) => [
        { type: 'Messages', id: conversationId },
        'Chats', // Invalidar chats porque el último mensaje cambió
      ],
    }),
    addReaction: builder.mutation({
      query: (reactionData) => ({
        url: 'chat/reaction',
        method: 'POST',
        body: reactionData,
      }),
      // Optimización: Las reacciones solo afectan a la conversación específica
      invalidatesTags: (result, error, { reactableId }) => {
        // Necesitamos obtener el conversationId del reactableId (messageId)
        // Por ahora, invalidamos solo los mensajes específicos
        return [
          { type: 'Messages', id: 'LIST' }, // Invalidar todas las conversaciones de mensajes
        ];
      },
    }),
  }),
});

export const {
  useGetChatsByUserIdQuery,
  useGetChatByIdQuery,
  useCreateChatMutation,
  useUpdateChatMutation,
  useSendMessageMutation,
  useAddReactionMutation,
} = chatApi;