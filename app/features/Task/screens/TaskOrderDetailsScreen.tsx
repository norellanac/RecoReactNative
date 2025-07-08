import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Text, Button } from '@/app/components/atoms';
import { Screen } from '@/app/components/templates';
import { useRoute, useNavigation } from '@react-navigation/native';
import {
  useGetOrderByIdQuery,
  useDeleteOrderMutation,
} from '@/app/services/ordersApi';
import { getApiImageUrl } from '@/app/utils/Environment';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useUpdateOrderMutation } from '@/app/services/ordersApi';

const TaskOrderDetailsScreen = () => {
  const { t } = useTranslation();
  const route = useRoute();
  const navigation = useNavigation();
  const { orderId } = route.params || {};
  const [updateOrder, { isLoading: isUpdating, error }] =
    useUpdateOrderMutation();
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();

  const handleUpdateStatus = async (status: number) => {
    try {
      await updateOrder({ id: orderId, status }).unwrap();
      Alert.alert(
        t('common.success', 'Success'),
        t(
          'taskOrderDetails.statusUpdated',
          'Order status updated successfully!',
        ),
        [
          {
            text: t('common.ok', 'OK'),
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (e) {
      Alert.alert(
        t('common.error', 'Error'),
        t(
          'taskOrderDetails.statusUpdateError',
          'Could not update order status.',
        ),
      );
    }
  };

  const handleDelete = async () => {
    try {
      await deleteOrder(orderId).unwrap();
      Alert.alert(
        t('common.success', 'Success'),
        t('taskOrderDetails.deleted', 'Order deleted successfully!'),
        [
          {
            text: t('common.ok', 'OK'),
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (e) {
      Alert.alert(
        t('common.error', 'Error'),
        t('taskOrderDetails.deleteError', 'Could not delete order.'),
      );
    }
  };

  const { data, isLoading, isError } = useGetOrderByIdQuery(orderId);

  if (isLoading) {
    return (
      <Text style={{ textAlign: 'center', marginTop: 40 }}>Loading...</Text>
    );
  }

  if (isError || !data?.data) {
    return (
      <Text style={{ textAlign: 'center', marginTop: 40 }}>
        Order not found.
      </Text>
    );
  }

  const order = data.data;
  const detail = order.details?.[0];
  const service = detail?.productService;
  const provider = order?.user; // El comercio/proveedor
  const comment = order.comment;

  const dateObj = new Date(order.startDate);
  const formattedDate = dateObj.toLocaleDateString();
  const formattedTime = dateObj.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const renderActions = () => {
    switch (order.status) {
      case 1: // Scheduled
        return (
          <>
            <Button
              title="Accept Task"
              variant="filled"
              style={styles.button}
              onPress={() => handleUpdateStatus(2)} // 2 = In Progress
              disabled={isUpdating}
            />
            <Button
              title="Not interested"
              variant="tonal"
              style={[styles.button, { marginTop: 12 }]}
              onPress={() => handleUpdateStatus(4)} // 4 = Canceled
              disabled={isUpdating}
            />
            <Button
              title="Chat with provider"
              variant="tonal"
              style={styles.button}
              onPress={() => {}}
              disabled={isUpdating}
            />
            <Button
              title="Find a new professional"
              variant="text"
              style={[styles.button, { marginTop: 12 }]}
              onPress={() => navigation.navigate('AllServices')}
              disabled={isUpdating}
            />
          </>
        );
      case 2: // In Progress
        return (
          <>
            <Button
              title="Chat with provider"
              variant="tonal"
              style={[styles.button, { marginTop: 12 }]}
              onPress={() => {}}
              disabled={isUpdating}
            />
            <Button
              title="Mark as completed"
              variant="filled"
              style={styles.button}
              onPress={() => handleUpdateStatus(3)} // 3 = Completed
              disabled={isUpdating}
            />
            <Button
              title="Cancel Task"
              variant="text"
              style={[styles.button, { marginTop: 12 }]}
              onPress={() => handleUpdateStatus(4)} // 4 = Canceled
              disabled={isUpdating}
            />
          </>
        );
      case 3: // Completed
        return (
          <>
            <Button
              title="Rate"
              variant="filled"
              style={styles.button}
              onPress={() =>
                navigation.navigate('RateScreen', {
                  service: {
                    id: service?.id,
                    urlImage: service?.urlImage,
                    name: service?.name,
                  },
                })
              }
              disabled={isUpdating}
            />
            <Button
              title="Delete Task"
              variant="outlined"
              style={[styles.button, { marginTop: 12 }]}
              onPress={handleDelete}
              disabled={isUpdating}
              endIcon={
                <Ionicons name="trash-outline" size={20} color="#6750A4" />
              }
            />
          </>
        );
      case 4: // Canceled
        return (
          <>
            <Button
              title="Rate"
              variant="filled"
              style={styles.button}
              onPress={() =>
                navigation.navigate('RateScreen', {
                  service: {
                    id: service?.id,
                    urlImage: service?.urlImage,
                    name: service?.name,
                  },
                })
              }
              disabled={isUpdating}
            />
            <Button
              title="Delete Task"
              variant="outlined"
              style={[styles.button, { marginTop: 12 }]}
              onPress={handleDelete}
              disabled={isUpdating}
              endIcon={
                <Ionicons name="trash-outline" size={20} color="#6750A4" />
              }
            />
          </>
        );
      default:
        return null;
    }
  };

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
        onLeftIconPress: () => navigation.navigate('Task'),
      }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          {/* Foto y nombre del comercio/proveedor */}
          <View style={styles.headerRow}>
            <Image
              source={getApiImageUrl(service?.urlImage)}
              style={styles.image}
            />
            <View style={styles.titleContainer}>
              <Text
                variant="title"
                size="medium"
                color="info"
                style={styles.sectionTitle}
              >
                Task assigned to
              </Text>
              <Text
                variant="title"
                size="medium"
                color="info"
                style={styles.title}
                numberOfLines={2}
              >
                {service?.name}
              </Text>
            </View>
          </View>

          {/* Descripción de la tarea */}
          <Text
            variant="title"
            size="medium"
            color="info"
            style={styles.sectionTitle}
          >
            Task details
          </Text>
          <Text
            variant="body"
            size="medium"
            color="secondary"
            style={styles.sectionDescription}
          >
            {comment}
          </Text>

          {/* Fecha y hora */}
          <Text
            variant="title"
            size="medium"
            color="info"
            style={styles.sectionTitle}
          >
            Time and date
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

          {/* Botones */}
          {isUpdating ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ActivityIndicator size="large" color="#7B61FF" />
              <Text style={{ marginTop: 16 }}>
                {t('taskOrderDetails.updating', 'Updating order...')}
              </Text>
            </View>
          ) : (
            renderActions()
          )}
        </View>
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
  button: {
    width: '100%',
    marginTop: 16,
  },
});

export default TaskOrderDetailsScreen;
