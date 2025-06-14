import React, { useState } from 'react';
import { View, StyleSheet, Image, TextInput, ScrollView } from 'react-native';
import { Text, Button, Icon } from '@/app/components/atoms';
import { Screen } from '../../../components/templates';
import { useRoute, useNavigation } from '@react-navigation/native';
import ModalComponent from '@/app/components/molecules/ModalComponent';
import { getApiImageUrl } from '@/app/utils/Environment';
import { useCreateOrderMutation } from '@/app/services/ordersApi';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectAuth } from '@/app/redux/slices/authSlice';

const TaskDetailsScreen = () => {
  const { t } = useTranslation();
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useSelector(selectAuth);
  const userId = user?.id;
  const { service, dateTime, imageUrl } = route.params || {};
  const [userText, setUserText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation();

  if (!service || !dateTime) {
    return <Text>{t('taskDetails.noData', 'No data available')}</Text>;
  }

  const handleCompleteRequest = () => {
    setModalVisible(true);
  };

  const handleSendOrder = async () => {
    try {
      const orderBody = {
        userId: userId,
        totalAmount: service.price,
        status: 1,
        comment: userText,
        startDate: dateTime,
        endDate: dateTime,
        details: [
          {
            productServiceId: service.id,
            quantity: 1,
            price: service.price,
            discount: 0,
            charge: 0,
            comment: userText,
          },
        ],
      };

      const createdOrder = await createOrder(orderBody).unwrap();
      setModalVisible(false);
      navigation.navigate('TaskStack', {
        screen: 'TaskOrderDetailsScreen',
        params: { orderId: createdOrder.data.id },
      });
    } catch (error) {
      // Maneja el error (puedes mostrar un mensaje)
      console.error('Error creating order:', error);
    }
  };

  const dateObj = new Date(dateTime);
  const formattedDate = dateObj.toLocaleDateString();
  const formattedTime = dateObj.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Screen
      statusBarProps={{
        showBackButton: true,
        title: (
          <Text
            variant="headline"
            size="small"
            color="info"
            style={{ marginTop: 8 }}
          >
            {t('services.taskDetails', 'Task Details')}
          </Text>
        ),
        onLeftIconPress: () => navigation.goBack(),
      }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Image source={getApiImageUrl(imageUrl)} style={styles.image} />
            <View style={styles.titleContainer}>
              <Text
                variant="title"
                size="medium"
                color="info"
                style={styles.title}
                numberOfLines={2}
              >
                {service.name}
              </Text>
            </View>
          </View>
          <Text
            variant="headline"
            size="small"
            color="info"
            style={styles.sectionTitle}
          >
            {t('taskDetails.startConversation', 'Start a conversation')}
          </Text>
          <Text
            variant="body"
            size="medium"
            color="secondary"
            style={styles.sectionDescription}
          >
            {t(
              'taskDetails.shareDetails',
              "You're almost there! Share some details to prepare your Specialist for the job.",
            )}
          </Text>
          <Text
            variant="title"
            size="medium"
            color="info"
            style={styles.sectionTitle}
          >
            {t('taskDetails.timeAndDate', 'Time and date')}
          </Text>
          <View style={styles.timeRow}>
            <Ionicons
              name="calendar-outline"
              size={20}
              color="#7B61FF"
              style={{ marginRight: 6 }}
            />
            <Text
              variant="body"
              size="medium"
              color="primary"
              style={styles.timeText}
            >
              {formattedDate}
            </Text>
            <Ionicons
              name="time-outline"
              size={20}
              color="#7B61FF"
              style={{ marginLeft: 18, marginRight: 6 }}
            />
            <Text
              variant="body"
              size="medium"
              color="primary"
              style={styles.timeText}
            >
              {formattedTime}
            </Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder={t(
              'taskDetails.inputPlaceholder',
              'Describe your request...',
            )}
            multiline
            value={userText}
            onChangeText={setUserText}
          />
          <Button
            title={t('taskDetails.completeRequest', 'Complete request')}
            variant="filled"
            onPress={handleCompleteRequest}
            disabled={!userText.trim()}
            style={[
              styles.button,
              { backgroundColor: userText.trim() ? '#6750A4' : '#E0E0E0' },
            ]}
          />
        </View>
        <ModalComponent
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onConfirm={handleSendOrder}
          title={t('taskDetails.confirmTitle', 'Confirm your request?')}
          confirmButtonText={t('taskDetails.confirm', 'Confirm')}
          cancelButtonText={t('taskDetails.cancel', 'Cancel')}
        >
          <Text
            variant="body"
            size="medium"
            color="secondary"
            style={styles.modalDescription}
          >
            {t(
              'taskDetails.confirmMessage',
              'Are you sure you want to send your request for {{serviceName}}?',
              { serviceName: service.name },
            )}
          </Text>
        </ModalComponent>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    elevation: 2,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 24,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  title: {
    marginBottom: 8,
    textAlign: 'left',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  sectionDescription: {
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  timeText: {
    marginRight: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    width: '100%',
    minHeight: 80,
    marginTop: 8,
    marginBottom: 16,
  },
  button: {
    width: '100%',
    marginTop: 16,
  },
  modalDescription: {
    marginBottom: 16,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});

export default TaskDetailsScreen;
