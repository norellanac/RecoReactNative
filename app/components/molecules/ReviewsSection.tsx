import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text, Button } from '@/app/components/atoms';
import { Icon } from '@/app/components/atoms/Icon';
import { Review } from '@/app/types/api/modelTypes';
import { useTranslation } from 'react-i18next';

type Props = {
  reviews: Review[];
  baseUrl?: string;
  onSeeAll?: () => void;
  stylesOverride?: any;
};

const ReviewsSection: React.FC<Props> = ({
  reviews,
  baseUrl = '',
  onSeeAll,
  stylesOverride = {},
}) => {
  const { t } = useTranslation();

  return (
    <View
      style={[
        styles.sectionReviewsContainer,
        stylesOverride.sectionReviewsContainer,
      ]}
    >
      <View style={[styles.sectionHeader, stylesOverride.sectionHeader]}>
        <Text
          variant="title"
          size="medium"
          color="info"
          style={[styles.sectionTitle, stylesOverride.sectionTitle]}
        >
          {t('services.serviceDetails.reviews', 'Reviews')}
        </Text>
        {/* <Button
          title={t('services.serviceDetails.seeAll', 'See All')}
          variant="text"
          color="primary"
          size="large"
          style={[styles.seeAll, stylesOverride.seeAll]}
          onPress={onSeeAll}
        /> */}
      </View>

      {/* Review List */}
      {reviews.length === 0 ? (
        <Text
          variant="body"
          size="medium"
          color="secondary"
          style={[styles.noReviewsText, stylesOverride.noReviewsText]}
        >
          {t(
            'services.serviceDetails.noReviews',
            'No reviews yet. Be the first to leave a review!',
          )}
        </Text>
      ) : (
        reviews.map((review, idx) => (
          <View
            key={review.id || idx}
            style={[styles.reviewCard, stylesOverride.reviewCard]}
          >
            <View style={[styles.reviewHeader, stylesOverride.reviewHeader]}>
              <Image
                source={
                  review.user?.avatarUrl
                    ? {
                        uri: review.user.avatarUrl.startsWith('/')
                          ? baseUrl + review.user.avatarUrl
                          : review.user.avatarUrl,
                      }
                    : require('@/app/assets/img/default-Reco-image.png')
                }
                style={[styles.reviewUserImage, stylesOverride.reviewUserImage]}
              />
              <Text
                variant="body"
                size="medium"
                color="info"
                style={[styles.reviewUser, stylesOverride.reviewUser]}
              >
                {review.user?.name ?? 'Anonymous'}{' '}
              </Text>
              <View
                style={[styles.reviewRatingBtn, stylesOverride.reviewRatingBtn]}
              >
                <Text
                  variant="body"
                  size="medium"
                  color="primary"
                  style={{ fontWeight: 'bold' }}
                >
                  ★ {review.rating}
                </Text>
              </View>
            </View>
            <Text
              variant="body"
              size="medium"
              color="secondary"
              style={[styles.reviewText, stylesOverride.reviewText]}
            >
              {review.comment}
            </Text>
            <View style={[styles.reviewFooter, stylesOverride.reviewFooter]}>
              <Icon
                name="favorite"
                family="MaterialIcons"
                size={16}
                color="#F76B6A"
              />
              <Text style={[styles.reviewLikes, stylesOverride.reviewLikes]}>
                {review.likes ?? 0}
              </Text>
              <Text style={[styles.reviewDate, stylesOverride.reviewDate]}>
                | {new Date(review.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionReviewsContainer: {
    backgroundColor: '#F3ECFF',
    paddingBottom: 20,
    marginBottom: 10,
    marginTop: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 18,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginHorizontal: 18,
    marginTop: 25,
    marginBottom: 6,
  },
  seeAll: {
    fontWeight: 'bold',
  },
  noReviewsText: {
    textAlign: 'left',
    marginLeft: 20,
    marginTop: 12,
    marginBottom: 12,
  },
  reviewCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 12,
    marginHorizontal: 18,
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reviewUserImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  reviewUser: {
    fontWeight: 'bold',
    flex: 1,
  },
  reviewRatingBtn: {
    borderColor: '#7B61FF',
    borderWidth: 1,
    borderRadius: 32,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  reviewText: {
    marginTop: 8,
  },
  reviewFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  reviewLikes: {
    color: '#F76B6A',
    fontSize: 13,
  },
  reviewDate: {
    color: '#7B7B7B',
    fontSize: 12,
    marginLeft: 8,
  },
});

export default ReviewsSection;
