import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { ServicesStackParams } from './ServicesStack';
import { useGetProductByIdQuery } from '@/app/services/productApi';
import { Text, Button } from '@/app/components/atoms';
import { Icon } from '@/app/components/atoms/Icon';

type ServiceDetailsRouteProp = RouteProp<ServicesStackParams, 'ServiceDetails'>;

const ServiceDetails = () => {
  const route = useRoute<ServiceDetailsRouteProp>();
  const navigation = useNavigation();
  const { serviceId } = route.params;

  const { data, isLoading } = useGetProductByIdQuery(serviceId);

  if (isLoading || !data?.data) {
    return (
      <View style={styles.centered}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const service = data.data;
  const provider = service.user;
  const reviews = service.reviews || [];
  const images = [
    {
      uri: service.urlImage || 'https://picsum.photos/220/200',
    },
    // Puedes agregar más imágenes si tu API las provee
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Image */}
      <View style={styles.headerImageContainer}>
        <Image source={images[0]} style={styles.headerImage} />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" family="Ionicons" size={26} color="#fff" />
        </TouchableOpacity>
        <View style={styles.carouselDots}>
          <View style={[styles.dot, { backgroundColor: '#7B61FF' }]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>

      {/* Title & Bookmark */}
      <View style={styles.titleRow}>
        <Text style={styles.title}>{service.name}</Text>
        <Icon
          name="bookmark-outline"
          family="MaterialCommunityIcons"
          size={26}
          color="#7B61FF"
        />
      </View>

      {/* Provider, Rating, Location */}
      <View style={styles.providerRow}>
        <Text style={styles.providerName}>
          {provider?.name} {provider?.lastname}
        </Text>
        <Icon name="star" family="MaterialIcons" size={16} color="#F7B500" />
        <Text style={styles.ratingText}>
          {service.averageRating ?? '4.8'} ({reviews.length} reviews)
        </Text>
      </View>
      <View style={styles.infoRow}>
        <View style={styles.chip}>
          <Text style={styles.chipText}>
            {service.categories?.[0]?.name ?? 'Service'}
          </Text>
        </View>
        <Icon
          name="location-on"
          family="MaterialIcons"
          size={16}
          color="#7B61FF"
        />
        <Text style={styles.locationText}>
          {service.locations?.[0]?.name ?? 'No address'}
        </Text>
      </View>

      {/* Price */}
      <Text style={styles.price}>
        ${service.price} <Text style={styles.priceNote}>(Floor price)</Text>
      </Text>

      {/* About me */}
      <Text style={styles.sectionTitle}>About me</Text>
      <Text style={styles.aboutText} numberOfLines={3}>
        {service.description}
      </Text>
      <TouchableOpacity>
        <Text style={styles.readMore}>Read more...</Text>
      </TouchableOpacity>

      {/* Photos & Videos */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Photos & Videos</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={images}
        horizontal
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => (
          <Image source={item} style={styles.mediaImage} />
        )}
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 12 }}
      />

      {/* Reviews */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          <Icon name="star" family="MaterialIcons" size={16} color="#F7B500" />{' '}
          {service.averageRating ?? '4.8'} ({reviews.length} reviews)
        </Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      {/* Review filters */}
      <View style={styles.reviewFilters}>
        <Button title="All" variant="outlined" style={styles.reviewFilterBtn} />
        <Button title="5" variant="outlined" style={styles.reviewFilterBtn} />
        <Button title="4" variant="outlined" style={styles.reviewFilterBtn} />
        <Button title="3" variant="outlined" style={styles.reviewFilterBtn} />
        <Button title="2" variant="outlined" style={styles.reviewFilterBtn} />
      </View>
      {/* Review List */}
      {reviews.map((review, idx) => (
        <View key={review.id || idx} style={styles.reviewCard}>
          <View style={styles.reviewHeader}>
            <Text style={styles.reviewUser}>{review.user?.name ?? 'User'}</Text>
            <Button
              title={`★ ${review.rating}`}
              variant="outlined"
              style={styles.reviewRatingBtn}
              textStyle={{ fontWeight: 'bold', color: '#7B61FF' }}
            />
          </View>
          <Text style={styles.reviewText}>{review.comment}</Text>
          <View style={styles.reviewFooter}>
            <Icon
              name="favorite"
              family="MaterialIcons"
              size={16}
              color="#F76B6A"
            />
            <Text style={styles.reviewLikes}>{review.likes ?? 0}</Text>
            <Text style={styles.reviewDate}>3 weeks ago</Text>
          </View>
        </View>
      ))}

      {/* Bottom Buttons */}
      <View style={styles.bottomButtons}>
        <Button title="Message" variant="outlined" style={styles.bottomBtn} />
        <Button title="Book Now" variant="filled" style={styles.bottomBtn} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerImageContainer: { position: 'relative', height: 220, marginBottom: 12 },
  headerImage: {
    width: '100%',
    height: 220,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    backgroundColor: '#0006',
    borderRadius: 20,
    padding: 4,
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
  title: { fontSize: 24, fontWeight: 'bold', color: '#222' },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 18,
    marginTop: 8,
    gap: 6,
  },
  providerName: { fontWeight: 'bold', color: '#7B61FF', fontSize: 16 },
  ratingText: { color: '#222', fontSize: 14 },
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
    paddingVertical: 2,
  },
  chipText: { color: '#7B61FF', fontWeight: 'bold', fontSize: 12 },
  locationText: { color: '#7B7B7B', fontSize: 14 },
  price: {
    color: '#7B61FF',
    fontWeight: 'bold',
    fontSize: 22,
    marginHorizontal: 18,
    marginTop: 12,
  },
  priceNote: { color: '#7B7B7B', fontSize: 13 },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 17,
    marginHorizontal: 18,
    marginTop: 18,
    marginBottom: 6,
  },
  aboutText: { color: '#444', fontSize: 15, marginHorizontal: 18 },
  readMore: {
    color: '#7B61FF',
    fontWeight: 'bold',
    marginHorizontal: 18,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 18,
    marginTop: 18,
  },
  seeAll: { color: '#7B61FF', fontWeight: 'bold', fontSize: 14 },
  mediaImage: { width: 110, height: 90, borderRadius: 16, marginRight: 10 },
  reviewFilters: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 18,
    marginTop: 10,
    marginBottom: 8,
  },
  reviewFilterBtn: { minWidth: 44, paddingHorizontal: 0, borderRadius: 12 },
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
  reviewUser: { fontWeight: 'bold', color: '#222', fontSize: 15 },
  reviewRatingBtn: {
    borderColor: '#7B61FF',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  reviewText: { color: '#444', fontSize: 14, marginTop: 4 },
  reviewFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  reviewLikes: { color: '#F76B6A', fontSize: 13 },
  reviewDate: { color: '#7B7B7B', fontSize: 12, marginLeft: 8 },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 18,
    marginVertical: 24,
    gap: 12,
  },
  bottomBtn: { flex: 1, marginHorizontal: 4, borderRadius: 16 },
});

export default ServiceDetails;
