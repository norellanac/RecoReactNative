import React, { useState } from 'react';
import { View, FlatList, Image, StyleSheet } from 'react-native';
import { Text as CustomText } from '@/app/components/atoms/Text';
import { Text } from 'react-native';
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
import { ProductService } from '@/app/types/api/modelTypes';
import { RootState } from '@/app/redux/store/store';

interface AllServicesProps {
  navigation: {
    goBack: () => void;
    navigate: (screen: string, params?: any) => void;
  };
}

export const AllServices: React.FC<AllServicesProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const search = useSelector(
    (state: RootState) => state.filter.options.searchTerm,
  );

  const { filteredServices, updateSearchTerm } = useProductServiceFilterData();

  const dispatch = useDispatch();
  const handleSearchChange = (text: string) => dispatch(setSearchTerm(text));
  const handleSearchSubmit = () => updateSearchTerm(search);
  const handleClearSearch = () => dispatch(setSearchTerm(''));

  const ServiceItem: React.FC<{ item: ProductService }> = ({ item }) => {
    const dispatch = useDispatch();
    const isFavorite = useSelector((state: RootState) =>
      selectIsFavorite(state, item.id),
    );
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
          <CustomText
            variant="title"
            size="medium"
            color="info"
            style={styles.headerTitle}
          >
            {t('services.allServices.title', 'All Services')}
          </CustomText>
        ),
        onLeftIconPress: () => navigation.goBack(),
      }}
    >
      <View style={styles.container}>
        <SearchBar
          value={search}
          onChange={handleSearchChange}
          onSubmit={handleSearchSubmit}
          onClear={handleClearSearch}
          onFilterPress={() => setShowFilterModal(true)}
          placeholder={t('search.searchPlaceholder', 'Search services...')}
        />
        <FlatList<ProductService>
          data={filteredServices}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ServiceItem item={item} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Image
                source={NotFoundImage}
                style={styles.emptyImage}
                resizeMode="contain"
              />
              <Text style={styles.emptyTitle}>
                {t('services.allServices.noResults', 'No services found')}
              </Text>
              <Text style={styles.emptyDescription}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTitle: {
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
    paddingHorizontal: 20,
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: 'center',
    color: '#888',
    maxWidth: 320,
    lineHeight: 20,
  },
});

export default AllServices;
