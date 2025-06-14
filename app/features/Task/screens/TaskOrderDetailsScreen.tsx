import React from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { Text, Button } from '@/app/components/atoms';
import { Screen } from '@/app/components/templates';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useGetOrderByIdQuery } from '@/app/services/ordersApi'; // Ajusta el import según tu estructura
import { getApiImageUrl } from '@/app/utils/Environment';
import { useTranslation } from 'react-i18next';

const TaskOrderDetailsScreen = () => {
  const { t } = useTranslation();
  const route = useRoute();
  const navigation = useNavigation();
  const { orderId } = route.params || {};

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
                style={styles.title}
                numberOfLines={2}
              >
                {service?.name}
              </Text>
            </View>
          </View>

          {/* Descripción de la tarea */}
          <Text
            variant="headline"
            size="small"
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
            <Text
              variant="body"
              size="medium"
              color="primary"
              style={styles.timeText}
            >
              {formattedDate}
            </Text>
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
          <Button
            title="Find a new professional"
            variant="filled"
            style={styles.button}
            onPress={() => navigation.navigate('AllServices')}
          />
          <Button
            title="Cancel Task"
            variant="outlined"
            style={[styles.button, { marginTop: 12 }]}
            onPress={() => {
              // Aquí puedes abrir un modal de confirmación o llamar a tu endpoint de cancelación
            }}
          />
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
    gap: 16,
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
