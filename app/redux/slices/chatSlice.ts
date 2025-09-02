import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  conversations: [], // Cache de conversaciones
  activeConversationId: null, // ID del chat activo
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversations(state, action) {
      state.conversations = action.payload;
    },
    setActiveConversationId(state, action) {
      state.activeConversationId = action.payload;
    },
    addConversation(state, action) {
      state.conversations.push(action.payload);
    },
  },
});

export const { setConversations, setActiveConversationId, addConversation } = chatSlice.actions;
export default chatSlice.reducer;