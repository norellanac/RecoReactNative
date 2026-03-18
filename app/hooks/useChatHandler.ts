import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import {
  useGetChatsByUserIdQuery,
  useCreateChatMutation,
} from '@/app/services/chatApi';

const useChatHandler = () => {
  const navigation = useNavigation();
  const currentUserId = useSelector((state) => state.auth.user.id);
  
  const [createChat, { isLoading: isCreatingChat }] = useCreateChatMutation();
  const { data: chatsResponse, refetch } = useGetChatsByUserIdQuery(currentUserId, {
    skip: !currentUserId,
  });
  
  const conversations = chatsResponse?.data || [];

  // ✅ Actualizar para recibir tanto el ID como los datos del proveedor
  const startChatWith = async (otherUserId: number, providerData?: any) => {
    try {
      if (!currentUserId || !otherUserId) {
        console.error('Invalid parameters: currentUserId or otherUserId is missing.');
        return;
      }

      console.log('Starting chat with user:', otherUserId);

      // ✅ Buscar conversación existente
      const existingConversation = conversations.find(
        (conversation) =>
          (conversation.user1Id === currentUserId && conversation.user2Id === otherUserId) ||
          (conversation.user2Id === currentUserId && conversation.user1Id === otherUserId)
      );

      // ✅ Crear objeto otherUser para el ChatScreen
      const otherUser = {
        id: otherUserId,
        name: providerData?.name || 'Usuario',
        lastname: providerData?.lastname || '',
        avatarUrl: providerData?.avatarUrl || providerData?.urlImage || null,
      };

      if (existingConversation) {
        console.log('Navigating to existing conversation:', existingConversation.id);
        
        navigation.navigate('ChatStack', {
          screen: 'ChatScreen',
          params: {
            conversationId: existingConversation.id,
            otherUser: otherUser, // ✅ Pasar el objeto como espera ChatScreen
          },
        });
      } else {
        // ✅ Crear nueva conversación
        const newConversation = await createChat({
          user1Id: currentUserId,
          user2Id: otherUserId,
        }).unwrap();

        console.log('New conversation created:', newConversation);

        const conversationId = newConversation?.data?.conversationId || newConversation?.data?.id;
        
        if (!conversationId) {
          console.error('Failed to create conversation: Missing conversation ID.');
          return;
        }

        console.log('Navigating to new conversation:', conversationId);
        
        navigation.navigate('ChatStack', {
          screen: 'ChatScreen',
          params: {
            conversationId: conversationId,
            otherUser: otherUser, // ✅ Pasar el objeto como espera ChatScreen
          },
        });

        refetch();
      }
    } catch (error) {
      console.error('Error starting chat:', error.message || error);
    }
  };

  return { 
    startChatWith,
    isLoading: isCreatingChat,
  };
};

export default useChatHandler;