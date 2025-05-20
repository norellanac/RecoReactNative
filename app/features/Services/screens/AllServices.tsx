import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Text } from '@/app/components/atoms';
import { Icon } from '@/app/components/atoms/Icon';
import { Screen } from '../../../components/templates';
import { useGetProductsQuery } from '@/app/services/productApi';
import { ServicesStackParams } from './ServicesStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<ServicesStackParams, 'AllServices'>;

const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/api\/v1\/$/, '') ||
  'https://dev.recolatam.com';

export const AllServices = ({ navigation } /** route */ : Props) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  const { data, isLoading } = useGetProductsQuery({ search });

  const renderServiceCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('ServicesStack', {
          screen: 'ServiceDetails',
          params: { serviceId: item.id },
        })
      }
      activeOpacity={0.9}
    >
      <View style={styles.cardImageContainer}>
        <Image
          source={
            item.urlImage
              ? {
                  uri: item.urlImage.startsWith('/')
                    ? BASE_URL + item.urlImage
                    : item.urlImage,
                }
              : require('@/app/assets/img/default-Reco-image.png')
          }
          style={styles.cardImage}
        />
      </View>
      <View style={styles.cardContent}>
        <Text variant="body" size="small" style={styles.providerName}>
          {item.user ? `${item.user.name} ${item.user.lastname}` : ''}
        </Text>
        <Text
          variant="title"
          size="medium"
          color="info"
          style={styles.serviceTitle}
        >
          {item.name}
        </Text>
        <Text variant="body" size="medium" color="primary" style={styles.price}>
          Q{item.price}{' '}
          <Text variant="body" size="small">
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
            {item.averageRating ?? '0'}
          </Text>
          <Text
            variant="body"
            size="small"
            color="secondary"
            style={styles.reviewsText}
          >
            | {item.reviews ? item.reviews.length : 0}{' '}
            {t('services.allServices.reviews', 'reviews')}
          </Text>
        </View>
      </View>
      <Icon
        name="bookmark-outline"
        family="MaterialCommunityIcons"
        size={24}
        color="#7B61FF"
        style={styles.bookmarkIcon}
      />
    </TouchableOpacity>
  );

  return (
    <Screen
      statusBarProps={{
        showBackButton: true,
        onLeftIconPress: () => navigation.goBack(),
      }}
    >
      <View style={styles.container}>
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <Icon
            name="search"
            family="Ionicons"
            size={20}
            color="#B0B0B0"
            style={{ marginLeft: 10 }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder={t(
              'services.allServices.searchPlaceholder',
              'Search services that you need',
            )}
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#B0B0B0"
          />
          <TouchableOpacity style={styles.filterButton}>
            <Icon name="filter" family="Ionicons" size={22} color="#7B61FF" />
          </TouchableOpacity>
        </View>

        {/* Results header */}
        <View style={styles.resultsHeader}>
          <Text
            variant="title"
            size="large"
            color="info"
            style={styles.resultsText}
          >
            {t('services.allServices.resultsFor', 'Results for')}{' '}
            <Text variant="title" size="large" style={styles.highlightText}>
              "{search || t('home_screen.all', 'All')}"
            </Text>
          </Text>
          <Text variant="title" size="medium" style={styles.foundText}>
            {data?.data?.items?.length ?? 0}{' '}
            {t('services.allServices.founds', 'founds')}
          </Text>
        </View>

        {/* Services List */}
        <FlatList
          data={data?.data?.items ?? []}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderServiceCard}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            !isLoading && (
              <Text style={{ textAlign: 'center', marginTop: 40 }}>
                {t('services.allServices.noResults', 'No services found')}
              </Text>
            )
          }
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8FF',
    paddingHorizontal: 12,
    paddingTop: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
    borderRadius: 16,
    marginBottom: 18,
    paddingHorizontal: 6,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10,
    color: '#222',
    backgroundColor: 'transparent',
  },
  filterButton: {
    padding: 8,
    borderRadius: 16,
    marginRight: 4,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  resultsText: {
    fontWeight: '500',
  },
  highlightText: {
    color: '#7B61FF',
    fontWeight: 'bold',
  },
  foundText: {
    color: '#7B61FF',
    fontWeight: 'bold',
  },
  card: {
    flexDirection: 'row',
    //alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    marginBottom: 18,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
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
    color: '#7B61FF',
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
  bookmarkIcon: {
    position: 'absolute',
    top: 18,
    right: 18,
  },
});

export default AllServices;
