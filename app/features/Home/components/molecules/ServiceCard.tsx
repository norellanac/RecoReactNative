import React from 'react';
import { ProductService } from '@/app/types/api/modelTypes';
import { getApiImageUrl } from '@/app/utils/Environment';
import { formatPrice, formatRating } from '@/app/utils/formatters';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

type ServiceCardProps = {
  service?: ProductService;
  onPress: () => void;
};

const ServiceCard: React.FC<ServiceCardProps> = ({
  service = {} as ProductService,
  onPress,
}) => {
  const { t } = useTranslation();

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image
          source={getApiImageUrl(service?.urlImage)}
          style={styles.image}
        />
      </View>
      <Text style={styles.name}>{service.name}</Text>
      <Text style={styles.price}>
        {formatPrice(service.price)} / {t('common.perDay', 'per day')}
      </Text>
      <Text style={styles.rating}>
        ⭐ {formatRating(service.averageRating)} ({service.reviews.length}{' '}
        {t('common.reviews', 'reseñas')})
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    margin: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: 250,
  },
  imageContainer: {
    paddingBottom: 10,
    width: 250,
    height: 125,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  price: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  rating: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default ServiceCard;
