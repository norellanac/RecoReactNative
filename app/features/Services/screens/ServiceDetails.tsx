import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import ModalComponent from '@/app/components/molecules/ModalComponent';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Screen } from '../../../components/templates';
import { Text, Button } from '@/app/components/atoms';
import { Icon } from '@/app/components/atoms/Icon';
import { getApiImageUrl } from '@/app/utils/Environment';
import Carousel from '@/app/components/molecules/Carousel';
import ReviewsSection from '@/app/components/molecules/ReviewsSection';
import { ProductService } from '@/app/types/api/modelTypes';
import { RootState } from '@/app/redux/store/store';
import {
  toggleFavorite,
  selectIsFavorite,
} from '@/app/redux/slices/favoritesSlice';
import { formatPrice, formatRating } from '@/app/utils/formatters';

type ServiceDetailsParams = {
  productService: ProductService;
};

type ServiceDetailsRouteProp = RouteProp<
  Record<string, ServiceDetailsParams>,
  'ServiceDetails'
>;

const ServiceDetails = () => {
  const { t } = useTranslation();
  const route = useRoute<ServiceDetailsRouteProp>();
  const navigation = useNavigation<any>();
  const { productService } = route.params;

  const dispatch = useDispatch();
  const isFavorite = useSelector((state: RootState) =>
    selectIsFavorite(state, productService.id),
  );

  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [currentPickerMode, setCurrentPickerMode] = useState<'date' | 'time'>(
    'date',
  );

  const handleFavoritePress = () => {
    dispatch(toggleFavorite(productService));
  };

  const handleBookNow = () => setCalendarVisible(true);
  const handleConfirm = () => {
    setCalendarVisible(false);
    navigation.navigate('TaskDetails', {
      service: productService,
      dateTime: selectedDate?.toISOString(),
      imageUrl: productService?.urlImage,
    });
  };
  const handleCancel = () => {
    setCalendarVisible(false);
    setSelectedDate(null);
  };

  const service = productService;
  const provider = service.user;
  const reviews = service.reviews || [];
  const images = [
    {
      img: getApiImageUrl(service?.urlImage),
    },
    {
      img: getApiImageUrl(service?.urlImage),
    },
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

        {/* Title & Favorite */}
        <View style={styles.titleRow}>
          <Text
            variant="title"
            size="large"
            color="info"
            style={styles.title}
            numberOfLines={3}
          >
            {service.name}
          </Text>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleFavoritePress}
          >
            <Icon
              name={isFavorite ? 'heart' : 'heart-outline'}
              family="MaterialCommunityIcons"
              size={32}
              color={isFavorite ? '#FF4757' : '#7B61FF'}
            />
          </TouchableOpacity>
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
            {formatRating(service.averageRating)} ({reviews.length}{' '}
            {t('services.serviceDetails.reviews', 'reviews')} )
          </Text>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.categoriesContainer}>
            {service.categories && service.categories.length > 0 ? (
              service.categories.map((category, index) => (
                <View key={category.id} style={styles.chip}>
                  <Text variant="body" size="small" style={styles.chipText}>
                    {category.name}
                  </Text>
                </View>
              ))
            ) : (
              <View style={styles.chip}>
                <Text variant="body" size="small" style={styles.chipText}>
                  Service
                </Text>
              </View>
            )}
          </View>
          <View style={styles.locationContainer}>
            <Icon
              name="location-on"
              family="MaterialIcons"
              size={16}
              color="#7B61FF"
            />
            <Text variant="body" size="medium" color="secondary">
              {service.location ?? 'No location'}
            </Text>
          </View>
        </View>

        {/* Price */}
        <Text variant="title" size="large" style={styles.price}>
          {formatPrice(service.price)}{' '}
          <Text variant="body" size="small" color="secondary">
            {t('services.serviceDetails.floorPrice', '/ per day')}
          </Text>
        </Text>

        {/* Bottom Buttons */}
        <View style={styles.bottomButtons}>
          {/* <Button title="Message" variant="outlined" style={styles.bottomBtn} /> */}
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
          confirmButtonStyle={{
            backgroundColor: !selectedDate ? '#E0E0E0' : '#6750A4',
          }}
          confirmButtonTextStyle={{
            color: !selectedDate ? '#B0B0B0' : '#fff',
            fontWeight: 'bold',
          }}
        >
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowPicker(true)}
          >
            <Text
              variant="body"
              size="medium"
              style={{ color: selectedDate ? '#222' : '#888' }}
            >
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
              mode={Platform.OS === 'ios' ? 'datetime' : currentPickerMode}
              display={Platform.OS === 'ios' ? 'default' : 'default'}
              onChange={(event, date) => {
                if (Platform.OS === 'android') {
                  setShowPicker(false);
                  if (date) {
                    if (currentPickerMode === 'date') {
                      // Keep the selected date and open time picker
                      const selectedTime = selectedDate || new Date();
                      const combinedDate = new Date(date.getTime());
                      combinedDate.setHours(selectedTime.getHours());
                      combinedDate.setMinutes(selectedTime.getMinutes());
                      setSelectedDate(combinedDate);

                      // Show time picker next
                      setCurrentPickerMode('time');
                      setTimeout(() => setShowPicker(true), 100);
                    } else {
                      // Time has been selected, update the final date
                      const finalDate = new Date(selectedDate.getTime());
                      finalDate.setHours(date.getHours());
                      finalDate.setMinutes(date.getMinutes());
                      setSelectedDate(finalDate);
                    }
                  }
                } else {
                  // iOS behavior - one step process
                  setShowPicker(false);
                  if (date) setSelectedDate(date);
                }
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
        <View>
          <ReviewsSection
            reviews={reviews}
            baseUrl={''}
            onSeeAll={() => {
              /* lógica para ver todas las reseñas */
            }}
          />
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImageContainer: {
    position: 'relative',
    height: 250,
    marginBottom: 12,
  },
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
    marginTop: 8,
    marginHorizontal: 18,
  },
  title: {
    fontWeight: 'bold',
    flex: 1,
    marginRight: 12,
  },
  favoriteButton: {
    padding: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 18,
    marginTop: 8,
    gap: 8,
    flexWrap: 'wrap',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    backgroundColor: '#F4F4F4',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
