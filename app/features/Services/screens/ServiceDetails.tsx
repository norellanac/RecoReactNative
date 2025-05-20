import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import ModalComponent from '@/app/components/molecules/ModalComponent';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { ServicesStackParams } from './ServicesStack';
import { useGetProductByIdQuery } from '@/app/services/productApi';
import { Screen } from '../../../components/templates';
import { Text, Button } from '@/app/components/atoms';
import { Icon } from '@/app/components/atoms/Icon';
import { getApiImageUrl } from '@/app/utils/Environment';
import Carousel from '@/app/components/molecules/CarouselCard';

type ServiceDetailsRouteProp = RouteProp<ServicesStackParams, 'ServiceDetails'>;

const ServiceDetails = () => {
  const { t } = useTranslation();
  const route = useRoute<ServiceDetailsRouteProp>();
  const navigation = useNavigation();
  const { serviceId } = route.params;

  const { data, isLoading } = useGetProductByIdQuery(serviceId);

  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const handleBookNow = () => setCalendarVisible(true);
  const handleConfirm = () => {
    setCalendarVisible(false);
  };
  const handleCancel = () => {
    setCalendarVisible(false);
    setSelectedDate(null);
  };

  if (isLoading || !data?.data) {
    return (
      <View style={styles.centered}>
        <Text
          variant="title"
          size="large"
          color="info"
          style={{ fontWeight: 'bold' }}
        >
          {t('services.serviceDetails.loading', 'Loading...')}
        </Text>
      </View>
    );
  }

  const service = data.data;
  const provider = service.user;
  const reviews = service.reviews || [];
  const images = [
    {
      img: getApiImageUrl(service?.urlImage),
    },
    {
      img: getApiImageUrl(service?.urlImage),
    },
    // Agregar más imágenes si la API las provee
  ];

  return (
    <Screen
      statusBarProps={{
        showBackButton: true,
        onLeftIconPress: () => navigation.goBack(),
      }}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Carousel images={images} />

        {/* Title & Bookmark */}
        <View style={styles.titleRow}>
          <Text variant="title" size="large" color="info" style={styles.title}>
            {service.name}
          </Text>
          <Icon
            name="bookmark-outline"
            family="Ionicons"
            size={26}
            color="#7B61FF"
          />
        </View>

        {/* Provider, Rating, Location */}
        <View style={styles.providerRow}>
          <Text
            variant="title"
            size="medium"
            color="primary"
            style={styles.providerName}
          >
            {provider?.name} {provider?.lastname}
          </Text>
          <Icon name="star" family="MaterialIcons" size={16} color="#F7B500" />
          <Text variant="body" size="medium" color="info">
            {service.averageRating ?? '0'} ({reviews.length}{' '}
            {t('services.serviceDetails.reviews', 'reviews')} )
          </Text>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.chip}>
            <Text variant="body" size="small" style={styles.chipText}>
              {service.categories?.[0]?.name ?? 'Service'}
            </Text>
          </View>
          <Icon
            name="location-on"
            family="MaterialIcons"
            size={16}
            color="#7B61FF"
          />
          <Text variant="body" size="medium" color="secondary">
            {service.locations?.[0]?.name ?? 'No address'}
          </Text>
        </View>

        {/* Price */}
        <Text variant="title" size="large" style={styles.price}>
          Q{service.price}{' '}
          <Text variant="body" size="small" color="secondary">
            {t('services.serviceDetails.floorPrice', '(Floor price)')}
          </Text>
        </Text>

        {/* Bottom Buttons */}
        <View style={styles.bottomButtons}>
          <Button title="Message" variant="outlined" style={styles.bottomBtn} />
          <Button
            title="Book Now"
            variant="filled"
            style={styles.bottomBtn}
            onPress={handleBookNow}
          />
        </View>

        <ModalComponent
          visible={calendarVisible}
          onClose={handleCancel}
          onConfirm={handleConfirm}
          title={t(
            'services.serviceDetails.selectDateTime',
            'Select date and time',
          )}
          confirmButtonText={t('common.confirm', 'Confirm')}
          cancelButtonText={t('common.cancel', 'Cancel')}
          isConfirmButtonDisabled={!selectedDate}
        >
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowPicker(true)}
          >
            <Text style={{ color: selectedDate ? '#222' : '#888' }}>
              {selectedDate
                ? selectedDate.toLocaleString()
                : t(
                    'services.serviceDetails.selectDate',
                    'Choose date and time',
                  )}
            </Text>
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={selectedDate || new Date()}
              mode="datetime"
              display="default"
              onChange={(_, date) => {
                setShowPicker(false);
                if (date) setSelectedDate(date);
              }}
              minimumDate={new Date()}
            />
          )}
        </ModalComponent>

        {/* About me */}
        <Text
          variant="title"
          size="medium"
          color="info"
          style={styles.sectionTitle}
        >
          {t(
            'services.serviceDetails.skillsAndExperience',
            'Skills & Experience',
          )}
        </Text>
        <Text
          variant="body"
          size="medium"
          color="secondary"
          style={styles.aboutText}
        >
          {service.description}
        </Text>

        {/* Reviews */}
        <View style={styles.sectionReviewsContainer}>
          <View style={styles.sectionHeader}>
            <Text
              variant="title"
              size="medium"
              color="info"
              style={styles.sectionTitle}
            >
              {t('services.serviceDetails.reviews', 'Reviews')}
            </Text>
            <Button
              title="See All"
              variant="text"
              color="primary"
              size="large"
              style={styles.seeAll}
            ></Button>
          </View>

          {/* Review List */}
          {reviews.length === 0 ? (
            <Text
              variant="body"
              size="medium"
              color="secondary"
              style={styles.noReviewsText}
            >
              {t(
                'services.serviceDetails.noReviews',
                'No reviews yet. Be the first to leave a review!',
              )}
            </Text>
          ) : (
            reviews.map((review, idx) => (
              <View key={review.id || idx} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Image
                    source={
                      review.user?.avatarUrl
                        ? {
                            uri: review.user.avatarUrl.startsWith('/')
                              ? BASE_URL + review.user.avatarUrl
                              : review.user.avatarUrl,
                          }
                        : require('@/app/assets/img/default-Reco-image.png')
                    }
                    style={styles.reviewUserImage}
                  />
                  <Text
                    variant="body"
                    size="medium"
                    color="info"
                    style={styles.reviewUser}
                  >
                    {review.user?.name ?? 'Anonymous'}{' '}
                  </Text>
                  <View style={styles.reviewRatingBtn}>
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
                  style={styles.reviewText}
                >
                  {review.comment}
                </Text>
                <View style={styles.reviewFooter}>
                  <Icon
                    name="favorite"
                    family="MaterialIcons"
                    size={16}
                    color="#F76B6A"
                  />
                  <Text style={styles.reviewLikes}>{review.likes ?? 0}</Text>
                  <Text style={styles.reviewDate}>
                    | {new Date(review.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Recents projects */}
        <View style={styles.sectionHeader}>
          <Text
            variant="title"
            size="medium"
            color="info"
            style={styles.sectionTitle}
          >
            {t('services.serviceDetails.recentProjects', 'Recent Projects')}
          </Text>
        </View>
        <View style={styles.projectsPlaceholder}>
          <Text
            variant="body"
            size="medium"
            color="secondary"
            style={{ textAlign: 'center', marginBottom: 4 }}
          >
            {t(
              'businessProfilePage.profile.noProjects',
              'There are no completed projects available.',
            )}
          </Text>
          <Text
            variant="body"
            size="small"
            color="secondary"
            style={{ textAlign: 'center' }}
          >
            {t(
              'businessProfilePage.profile.projectsComingSoon',
              'You will soon be able to see completed projects here.',
            )}
          </Text>
        </View>

        {/* Other skills */}
        <View style={styles.sectionHeader}>
          <Text
            variant="title"
            size="medium"
            color="info"
            style={styles.sectionTitle}
          >
            {t('services.serviceDetails.otherSkills', 'Other Skills')}
          </Text>
        </View>

        {!service.details || service.details.length === 0 ? (
          <View style={styles.projectsPlaceholder}>
            <Text
              variant="body"
              size="medium"
              color="secondary"
              style={{ textAlign: 'center', marginBottom: 4 }}
            >
              {t('businessProfilePage.profile.noSkills', 'No skills listed')}
            </Text>
          </View>
        ) : (
          <View style={styles.skillsGrid}>
            {service.details.map((detail, index) => (
              <View key={index} style={styles.skillCard}>
                <View style={styles.skillChip}>
                  <Text style={styles.skillChipText}>{detail.label}</Text>
                </View>
                <Text style={styles.skillValue}>{detail.value}</Text>
                <Text style={styles.skillDescription}>
                  {detail.description}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerImageContainer: { position: 'relative', height: 250, marginBottom: 12 },
  headerImage: {
    width: '100%',
    height: 250,
  },
  carouselDots: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 18,
    marginTop: 8,
  },
  title: {
    fontWeight: 'bold',
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 18,
    marginTop: 8,
    gap: 6,
  },
  providerName: {
    fontWeight: 'bold',
    //color: '#7B61FF',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 18,
    marginTop: 8,
    gap: 8,
  },
  chip: {
    backgroundColor: '#F4F4F4',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  chipText: {
    color: '#7B61FF',
    fontWeight: 'bold',
  },
  price: {
    color: '#7B61FF',
    fontWeight: 'bold',
    marginHorizontal: 18,
    marginTop: 12,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 14,
    width: 325,
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginHorizontal: 18,
    marginTop: 25,
    marginBottom: 6,
  },
  aboutText: {
    marginHorizontal: 18,
  },
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
  seeAll: {
    //color: '#7B61FF',
    fontWeight: 'bold',
  },
  noReviewsText: {
    textAlign: 'left',
    marginLeft: 20,
    marginTop: 12,
    marginBottom: 12,
  },
  mediaImage: {
    width: 110,
    height: 90,
    marginLeft: 18,
    borderRadius: 16,
    marginRight: 10,
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
  projectsPlaceholder: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 12,
    marginHorizontal: 18,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF8FF',
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginHorizontal: 18,
    marginTop: 10,
    marginBottom: 20,
  },
  skillCard: {
    flexBasis: '48%',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EADDFF',
  },
  skillChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#EADDFF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 6,
  },
  skillChipText: {
    color: '#6750A4',
    fontWeight: 'bold',
    fontSize: 13,
  },
  skillValue: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
  },
  skillDescription: {
    color: '#7B7B7B',
    fontSize: 13,
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 18,
    marginVertical: 24,
    gap: 12,
  },
  bottomBtn: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 16,
  },
});

export default ServiceDetails;
