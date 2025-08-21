import React, { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Text } from '@/app/components/atoms';
import { Button } from '@/app/components/atoms/Button';
import { Screen } from '../../../components/templates';
import { HomeStackParams } from './HomeStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ServiceCard from '../components/molecules/ServiceCard';
import { useGetProductsQuery } from '@/app/services/productApi';
import { useGetCategoriesQuery } from '@/app/services/categoryApi';
import { useTranslation } from 'react-i18next';
import { GreetingHeader } from '../components/molecules/GreetingHeader';
import slider_1 from '../../../assets/img/home_sliders/slider_1_Reco.png';
import slider_2 from '../../../assets/img/home_sliders/slider_2_Reco.png';
import Carousel from '@/app/components/molecules/Carousel';
import { ProductService } from '@/app/types/api/modelTypes';
import { SearchBar } from '@/app/components/molecules/SearchBar';
import SearchFilterModal from '@/app/components/molecules/SearchFilterModal';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchTerm } from '@/app/redux/slices/filterProductsSlice';
import CategoryList from '../components/molecules/CategoryList';

type Props = NativeStackScreenProps<HomeStackParams, 'Home'>;

export const LandingHome = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const search = useSelector((state) => state.filter.options.searchTerm);
  const dispatch = useDispatch();

  const handleSearchChange = (text: string) => {
    dispatch(setSearchTerm(text));
  };

  const handleSearchSubmit = () => {
    dispatch(setSearchTerm(search));
    navigation.navigate('SearchResults', { query: search });
  };

  const handleClearSearch = () => {
    dispatch(setSearchTerm(''));
  };
  const handleOpenFilters = () => setShowFilterModal(true);

  const {
    data: productsData,
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = useGetProductsQuery();

  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useGetCategoriesQuery();

  const topRatedServices = productsData?.data?.items
    ?.slice()
    ?.sort((a: any, b: any) => (b.averageRating || 0) - (a.averageRating || 0))
    ?.slice(0, 5);

  const categories = categoriesData?.data || [];

  if (isProductsLoading || isCategoriesLoading) {
    return (
      <Text style={styles.loading}>
        {t('home_screen.loading', 'Loading data...')}
      </Text>
    );
  }

  if (isProductsError || isCategoriesError) {
    return (
      <Text style={styles.error}>
        {t('home_screen.error', 'An error occurred while loading data.')}.
      </Text>
    );
  }

  return (
    <Screen statusBarProps={{}}>
      <GreetingHeader />
      <SearchBar
        value={search}
        onChange={handleSearchChange}
        onSubmit={handleSearchSubmit}
        onClear={handleClearSearch}
        onFilterPress={handleOpenFilters}
        placeholder={t(
          'home_screen.searchPlaceholder',
          'Search services that you need',
        )}
      />
      <SearchFilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
      />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 10,
        }}
      >
        <Carousel
          images={[
            {
              img: slider_2,
              //buttonText: 'Busca servicios de confianza',
              onButtonPress: () => navigation.navigate('AllServices'),
            },
            {
              img: slider_1,
              //buttonText: 'Explora categorías',
              onButtonPress: () => navigation.navigate('AllCategories'),
            },
          ]}
          autoScroll={true}
        />

        <View>
          <CategoryList
            categories={categories}
            onCategoryPress={(category) =>
              navigation.navigate('CategoryServices', {
                categoryId: category.id,
                categoryName: category.name,
              })
            }
            onViewAll={() => navigation.navigate('AllCategories')}
          />
        </View>

        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text
              variant="title"
              size="large"
              color="secondary"
              style={{
                textAlign: 'left',
                fontWeight: 'bold',
                marginTop: 15,
              }}
            >
              {t('home_screen.servicesAvailable', 'Services Available')}
            </Text>
            <Button
              variant="text"
              size="large"
              color="secondary"
              title={t('home_screen.viewAll', 'View all')}
              onPress={() => navigation.navigate('AllServices')}
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {topRatedServices.map((service: ProductService) => (
              <ServiceCard
                key={service.id}
                service={service}
                onPress={() =>
                  navigation.navigate('ServicesStack', {
                    screen: 'ServiceDetails',
                    params: { productService: service },
                  })
                }
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  loading: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  error: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'red',
  },
});
