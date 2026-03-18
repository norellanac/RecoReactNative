import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, StyleSheet } from 'react-native';
import { Text as CustomText } from '@/app/components/atoms/Text';
import { Text } from 'react-native';
import { Screen } from '@/app/components/templates/Screen';
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
import { ProductService } from '@/app/types/api/modelTypes';
import { RootState } from '@/app/redux/store/store';
import { useGetProductsQuery } from '@/app/services/productApi';

interface CategoryServicesProps {
  navigation: {
    goBack: () => void;
    navigate: (screen: string, params?: any) => void;
  };
  route: {
    params: {
      categoryId: number;
      categoryName: string;
    };
  };
}

export const CategoryServices: React.FC<CategoryServicesProps> = ({
  navigation,
  route,
}) => {
  const { t } = useTranslation();
  const { categoryId, categoryName } = route.params;
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');

  const { data: productsData, isLoading, isError } = useGetProductsQuery();
  const allProducts: ProductService[] = Array.isArray(productsData?.data?.items)
    ? productsData.data.items
    : [];

  if (isLoading) {
    return (
      <Screen>
        <View style={styles.loadingContainer}>
          <CustomText>{t('common.loading', 'Loading...')}</CustomText>
        </View>
      </Screen>
    );
  }

  if (isError) {
    return (
      <Screen>
        <View style={styles.errorContainer}>
          <CustomText>{t('common.error', 'Error loading data')}</CustomText>
        </View>
      </Screen>
    );
  }

  const categoryProducts = allProducts.filter((product) =>
    product.categories?.some((category) => category.id === categoryId),
  );

  const filteredProducts = categoryProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase()),
  );

  const dispatch = useDispatch();
  const handleSearchChange = (text: string) => setSearch(text);
  const handleSearchSubmit = () => {};
  const handleClearSearch = () => setSearch('');

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
            {categoryName}
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
          data={filteredProducts}
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
                {t(
                  'services.categoryProducts.noResults',
                  'No services found in this category',
                )}
              </Text>
              <Text style={styles.emptyDescription}>
                {t(
                  'services.categoryProducts.noResultsDescription',
                  'Try adjusting your search or check other categories.',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 12,
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

export default CategoryServices;
