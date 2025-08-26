import React from 'react';
import { TouchableOpacity, View, Image, StyleSheet } from 'react-native';
import { Text } from '@/app/components/atoms';
import { Icon } from '@/app/components/atoms/Icon';
import { getApiImageUrl } from '@/app/utils/Environment';
import { formatPrice, formatRating } from '@/app/utils/formatters';
import { ProductService } from '@/app/types/api/modelTypes';
import { useTranslation } from 'react-i18next';

type Props = {
  service: ProductService;
  onPress: () => void;
  showBookmark?: boolean;
  showProvider?: boolean;
  rightAction?: React.ReactNode;
  showFavorite?: boolean;
  isFavorite?: boolean;
  onFavoritePress?: () => void;
};

export const ServiceCard: React.FC<Props> = ({
  service,
  onPress,
  showBookmark = true,
  showProvider = true,
  rightAction,
  showFavorite = false,
  isFavorite = false,
  onFavoritePress,
}) => {
  const { t } = useTranslation();

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.cardImageContainer}>
        <Image
          source={getApiImageUrl(service.urlImage)}
          style={styles.cardImage}
        />
      </View>
      <View style={styles.cardContent}>
        {showProvider && (
          <Text variant="body" size="small" style={styles.providerName}>
            {service.user
              ? `${service.user.name} ${service.user.lastname}`
              : ''}
          </Text>
        )}
        <Text
          variant="title"
          size="medium"
          color="info"
          style={styles.serviceTitle}
        >
          {service.name}
        </Text>
        <Text variant="body" size="medium" color="primary" style={styles.price}>
          {formatPrice(service.price)}{' '}
          <Text variant="body" size="small" color="secondary">
            {t('services.allServices.perDay', '/ per day')}
          </Text>
        </Text>
        <View style={styles.ratingRow}>
          <Icon name="star" family="MaterialIcons" size={16} color="#F7B500" />
          <Text
            variant="body"
            size="medium"
            color="info"
            style={styles.ratingText}
          >
            {formatRating(service.averageRating)}
          </Text>
          <Text
            variant="body"
            size="small"
            color="secondary"
            style={styles.reviewsText}
          >
            | {service.reviews ? service.reviews.length : 0}{' '}
            {t('services.allServices.reviews', 'reviews')}
          </Text>
        </View>
      </View>
      {rightAction ? (
        <View style={styles.rightAction}>{rightAction}</View>
      ) : showFavorite ? (
        <TouchableOpacity style={styles.rightAction} onPress={onFavoritePress}>
          <Icon
            name={isFavorite ? 'heart' : 'heart-outline'}
            family="MaterialCommunityIcons"
            size={25}
            color={isFavorite ? '#FF4757' : '#7B61FF'}
          />
        </TouchableOpacity>
      ) : (
        showBookmark && (
          <View style={styles.rightAction}>
            <Icon
              name="bookmark-outline"
              family="MaterialCommunityIcons"
              size={25}
              color="#7B61FF"
            />
          </View>
        )
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 24,
    marginBottom: 9,
    marginTop: 9,
    marginHorizontal: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.09,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    position: 'relative',
  },
  cardImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 16,
    backgroundColor: '#F4F4F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    overflow: 'hidden',
  },
  cardImage: {
    width: 70,
    height: 70,
    borderRadius: 16,
    resizeMode: 'cover',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 40,
  },
  providerName: {
    color: '#7B7B7B',
    marginBottom: 2,
  },
  serviceTitle: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  price: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ratingText: {
    marginLeft: 4,
  },
  reviewsText: {
    marginLeft: 8,
  },
  rightAction: {
    position: 'absolute',
    top: 18,
    right: 18,
  },
});

export default ServiceCard;
