import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Text } from '@/app/components/atoms';
import { Icon } from '@/app/components/atoms/Icon';
import { Screen } from '../../../components/templates';
import { useGetProductsQuery } from '@/app/services/productApi';
import { HomeStackParams } from '../../Home/screens/HomeStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ServiceCard from '@/app/components/molecules/ServiceCard';
import {
  toggleFavorite,
  selectIsFavorite,
} from '@/app/redux/slices/favoritesSlice';

type Props = NativeStackScreenProps<HomeStackParams, 'AllServices'>;

const ServiceItem = ({ item, navigation }: { item: any; navigation: any }) => {
  const dispatch = useDispatch();
  const isFavorite = useSelector((state: any) =>
    selectIsFavorite(state, item.id),
  );

  const handleFavoriteToggle = () => {
    dispatch(toggleFavorite(item));
  };

  return (
    <ServiceCard
      service={item}
      onPress={() =>
        navigation.navigate('ServiceDetails', {
          productService: item,
        })
      }
      showFavorite={true}
      showBookmark={false}
      isFavorite={isFavorite}
      onFavoritePress={handleFavoriteToggle}
    />
  );
};

export const AllServices = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  const { data, isLoading } = useGetProductsQuery({ search });

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
            {t('services.allServices.title', 'All Services')}
          </Text>
        ),
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
            <Text
              variant="title"
              size="large"
              color="primary"
              style={styles.highlightText}
            >
              "{search || t('home_screen.all', 'All')}"
            </Text>
          </Text>
          <Text
            variant="title"
            size="medium"
            color="primary"
            style={styles.foundText}
          >
            {data?.data?.items?.length ?? 0}{' '}
            {t('services.allServices.founds', 'founds')}
          </Text>
        </View>

        {/* Services List */}
        <FlatList
          data={data?.data?.items ?? []}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ServiceItem item={item} navigation={navigation} />
          )}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            !isLoading ? (
              <Text
                variant="body"
                size="medium"
                style={{ textAlign: 'center', marginTop: 40 }}
              >
                {t('services.allServices.noResults', 'No services found')}
              </Text>
            ) : null
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
    fontWeight: 'bold',
  },
  foundText: {
    fontWeight: 'bold',
  },
});

export default AllServices;
