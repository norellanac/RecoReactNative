import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text, Button } from '@/app/components/atoms';
import { Icon } from '@/app/components/atoms/Icon';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const TaskCard = ({ task }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  // Servicio y usuario
  const detail = task.details?.[0];
  const service = detail?.productService;
  const user = task.user;

  // Fecha y hora (usando startDate)
  const dateObj = new Date(task.startDate);
  const date = dateObj.toLocaleDateString();
  const time = dateObj.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={{ flex: 1 }}>
          <Text
            variant="title"
            size="small"
            color="secondary"
            style={styles.cardTitle}
          >
            {service?.name || 'Task'}
          </Text>
          <View style={styles.row}>
            <Icon
              name="calendar-outline"
              family="Ionicons"
              size={22}
              color="#7B61FF"
            />
            <Text
              variant="body"
              size="medium"
              color="secondary"
              style={styles.cardText}
            >
              {date}
            </Text>
          </View>
          <View style={styles.row}>
            <Icon
              name="time-outline"
              family="Ionicons"
              size={22}
              color="#7B61FF"
            />
            <Text
              variant="body"
              size="medium"
              color="secondary"
              style={styles.cardText}
            >
              {time}
            </Text>
          </View>
        </View>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: user?.avatarUrl }} style={styles.avatar} />
          <Text
            variant="body"
            size="medium"
            color="secondary"
            style={styles.userName}
          >
            {user?.name} {user?.lastname}
          </Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.actionsRow}>
        <Button
          variant="text"
          title={t('taskCard.viewDetails', 'View details')}
          style={styles.actionButton}
          textStyle={styles.actionButtonText}
          onPress={() =>
            navigation.navigate('TaskStack', {
              screen: 'TaskOrderDetailsScreen',
              params: { orderId: task.id },
            })
          }
        />
        <View style={styles.verticalDivider} />
        <Button
          variant="text"
          title={t('taskCard.chat', 'Chat')}
          style={styles.actionButton}
          textStyle={styles.actionButtonText}
          onPress={() => {}}
        />
      </View>
    </View>
  );
};

// ...styles igual...

export default TaskCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    padding: 0,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    paddingBottom: 8,
  },
  cardTitle: {
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardText: {
    marginLeft: 8,
  },
  avatarContainer: {
    alignItems: 'center',
    marginLeft: 18,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 4,
    backgroundColor: '#eee',
  },
  userName: {
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 0,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    paddingVertical: 0,
    height: 48,
  },
  actionButton: {
    flex: 1,
    borderRadius: 0,
    backgroundColor: 'transparent',
    elevation: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
  },
  actionButtonText: {
    color: '#6C648B',
    fontSize: 16,
    fontWeight: '500',
  },
  verticalDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#E0E0E0',
  },
});

export default TaskCard;
