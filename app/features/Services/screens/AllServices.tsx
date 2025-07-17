import React, { useState } from 'react';
import { View, FlatList, Image } from 'react-native';
import { Text } from '@/app/components/atoms/Text';
import { Screen } from '@/app/components/templates/Screen';
import { useProductServiceFilterData } from '@/app/hooks/useProductServiceFilterData';
import ServiceCard from '@/app/components/molecules/ServiceCard';
import SearchFilterModal from '@/app/components/molecules/SearchFilterModal';
import { SearchBar } from '@/app/components/molecules/SearchBar';
import { useTranslation } from 'react-i18next';
import {
  toggleFavorite,
  selectIsFavorite,
} from '@/app/redux/slices/favoritesSlice';
import { useDispatch, useSelector } from 'react-redux';
import NotFoundImage from '@/app/assets/img/notFound.png';
import { setSearchTerm } from '@/app/redux/slices/filterProductsSlice';

export const AllServices = ({ navigation }) => {
  const { t } = useTranslation();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const search = useSelector((state) => state.filter.options.searchTerm);

  const { filteredServices, updateSearchTerm } = useProductServiceFilterData();

  const dispatch = useDispatch();
  const handleSearchChange = (text) => dispatch(setSearchTerm(text));
  const handleSearchSubmit = () => updateSearchTerm(search);
  const handleClearSearch = () => dispatch(setSearchTerm(''));

  const ServiceItem = ({ item }) => {
    const dispatch = useDispatch();
    const isFavorite = useSelector((state) => selectIsFavorite(state, item.id));
    return (
      <ServiceCard
        service={item}
        onPress={() =>
          navigation.navigate('ServiceDetails', { productService: item })
        }
        showFavorite={true}
        showBookmark={false}
        isFavorite={isFavorite}
        onFavoritePress={() => dispatch(toggleFavorite(item))}
      />
    );
  };

  return (
    <Screen
      statusBarProps={{
        showBackButton: true,
        title: (
          <Text
            variant="title"
            size="medium"
            color="info"
            style={{ marginTop: 8 }}
          >
            {t('services.allServices.title', 'All Services')}
          </Text>
        ),
        onLeftIconPress: () => navigation.goBack(),
      }}
    >
      <View style={{ flex: 1 }}>
        <SearchBar
          value={search}
          onChange={handleSearchChange}
          onSubmit={handleSearchSubmit}
          onClear={handleClearSearch}
          onFilterPress={() => setShowFilterModal(true)}
          placeholder={t('search.searchPlaceholder', 'Search services...')}
        />
        <FlatList
          data={filteredServices}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ServiceItem item={item} navigation={navigation} />
          )}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 80 }}>
              <Image
                source={NotFoundImage}
                style={{ width: '90%', height: '90%', marginBottom: 24 }}
                resizeMode="contain"
              />
              <Text
                variant="title"
                size="large"
                color="info"
                style={{ fontWeight: 'bold', marginBottom: 12 }}
              >
                {t('services.allServices.noResults', 'No services found')}
              </Text>
              <Text
                variant="body"
                size="medium"
                style={{ textAlign: 'center', color: '#888', maxWidth: 320 }}
              >
                {t(
                  'services.allServices.noResultsDescription',
                  'Try adjusting your filters or search for something else.',
                )}
              </Text>
            </View>
          }
        />
        <SearchFilterModal
          visible={showFilterModal}
          onClose={() => setShowFilterModal(false)}
        />
      </View>
    </Screen>
  );
};

export default AllServices;
