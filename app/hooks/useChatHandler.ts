import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import {
  useGetChatsByUserIdQuery,
  useCreateChatMutation,
} from '@/app/services/chatApi';
import {
  setActiveConversationId,
  addConversation,
} from '@/app/redux/slices/chatSlice';

const useChatHandler = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const currentUserId = useSelector((state) => state.auth.user.id);
  //const conversations = useSelector((state) => state.chat.conversations);
  const [createChat] = useCreateChatMutation();
  const { refetch, data } = useGetChatsByUserIdQuery(currentUserId);
  const conversations = data?.data || [];
  //console.error(conversations);

  const startChatWith = async (otherUserId, otherUser) => {
    try {
      // Validar parámetros
      if (!currentUserId || !otherUserId || !otherUser) {
        console.error('Invalid parameters: currentUserId, otherUserId, or otherUser is missing.');
        return;
      }

      // Buscar conversación existente
      const existingConversation = conversations.find(
        (conversation) =>
          (conversation.user1Id === currentUserId && conversation.user2Id === otherUserId) ||
          (conversation.user2Id === currentUserId && conversation.user1Id === otherUserId)
      );

      if (existingConversation) {
        // Navegar al chat existente
        dispatch(setActiveConversationId(existingConversation.id));
        console.log('Navigating to existing conversation:', {
          conversationId: existingConversation.id,
          otherUser,
        });
        navigation.navigate('ChatStack', {
          screen: 'ChatScreen',
          params: {
            conversationId: existingConversation.id,
            otherUser,
          },
        });
      } else {
        // Crear nueva conversación
        const newConversation = await createChat({
          user1Id: currentUserId,
          user2Id: otherUserId,
        }).unwrap();

        console.log('New conversation created:', newConversation);

        // Validar que la conversación tenga un ID
        if (!newConversation?.data?.conversationId) {
          console.error('Failed to create conversation: Missing conversation ID.');
          return;
        }

        // Guardar la nueva conversación en el estado global
        dispatch(
          addConversation({
            id: newConversation.data.conversationId, // Usar conversationId como ID
            user1Id: currentUserId,
            user2Id: otherUserId,
          })
        );
        dispatch(setActiveConversationId(newConversation.data.conversationId));

        // Navegar al nuevo chat
        console.log('Navigating to new conversation:', {
          conversationId: newConversation.data.conversationId,
          otherUser,
        });
        navigation.navigate('ChatStack', {
          screen: 'ChatScreen',
          params: {
            conversationId: newConversation.data.conversationId,
            otherUser,
          },
        });

        // Refrescar conversaciones desde la API
        refetch();
      }
    } catch (error) {
      console.error('Error starting chat:', error.message || error);
    }
  };

  return { startChatWith };
};

export default useChatHandler;