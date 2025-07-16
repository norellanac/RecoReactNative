import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Image } from 'react-native';
import { Text } from '@/app/components/atoms/Text';
import { Screen } from '@/app/components/templates/Screen';
import { useRoute } from '@react-navigation/native';
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

export const SearchResults = ({ navigation }) => {
  const { t } = useTranslation();
  const route = useRoute();
  const { query } = route.params;
  const [showFilterModal, setShowFilterModal] = useState(false);

  const { filteredServices, updateSearchTerm } = useProductServiceFilterData();

  React.useEffect(() => {
    updateSearchTerm(query);
  }, [query]);

  const {
    availableCategories,
    availableLocations,
    filters,
    updateCategories,
    updateLocationIds,
    resetFilters,
  } = useProductServiceFilterData();

  const ServiceItem = ({
    item,
    navigation,
  }: {
    item: any;
    navigation: any;
  }) => {
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
            {t('search.searchResults', 'Search Results')}
          </Text>
        ),
        onLeftIconPress: () => navigation.goBack(),
      }}
    >
      <View style={{ flex: 1 }}>
        <SearchBar
          value={query}
          onChange={(text) => navigation.setParams({ query: text })}
          onSubmit={() => updateSearchTerm(query)}
          onClear={() => navigation.setParams({ query: '' })}
          onFilterPress={() => setShowFilterModal(true)}
          placeholder="Search services..."
        />
        <View style={styles.resultsHeader}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text
              variant="title"
              size="medium"
              color="info"
              style={styles.resultsText}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {t('services.allServices.resultsFor', 'Results for')}{' '}
              <Text
                variant="title"
                size="medium"
                color="primary"
                style={styles.highlightText}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                "{query || t('home_screen.all', 'All Services')}"
              </Text>
            </Text>
          </View>
          <Text
            variant="title"
            size="medium"
            color="primary"
            style={styles.foundText}
          >
            {filteredServices.length}{' '}
            {t('services.allServices.founds', 'founds')}
          </Text>
        </View>
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
                {t('search.noResultsFound', 'No results found')}
              </Text>
              <Text
                variant="body"
                size="medium"
                style={{ textAlign: 'center', color: '#888', maxWidth: 320 }}
              >
                {t(
                  'search.noResultsFoundDescription',
                  'Sorry, the keyword you entered cannot be found, please check again or search with another keyword.',
                )}
              </Text>
            </View>
          }
        />
        <SearchFilterModal
          visible={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          // Pasa los props necesarios para filtros
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  resultsText: {
    fontWeight: '500',
    flexShrink: 1,
  },
  highlightText: {
    fontWeight: 'bold',
    flexWrap: 'wrap',
  },
  foundText: {
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
