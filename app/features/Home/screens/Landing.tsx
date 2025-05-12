import React from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@/app/components/atoms';
import { Button } from '@/app/components/atoms/Button';
import { Screen } from '../../../components/templates';
import { HomeStackParams } from './HomeStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import CategoryCard from '../components/molecules/CategoryCard';
import Carousel from '../components/molecules/CarouselCard';
import ServiceCard from '../components/molecules/ServiceCard';
import { useGetProductsQuery } from '@/app/services/productApi';
import { useGetCategoriesQuery } from '@/app/services/categoryApi';
import { TextInput } from '@/app/components/atoms';
import { Icon } from '@/app/components/atoms/Icon';
import { useTranslation } from 'react-i18next';
import CategoryChipList from '../components/molecules/CategoryChipList';

type Props = NativeStackScreenProps<HomeStackParams, 'Home'>;

export const LandingHome = ({ navigation } /** route */ : Props) => {
  const { t } = useTranslation();
  const [search, setSearch] = React.useState('');
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

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleClearSearch = () => {
    setSearch('');
  };

  return (
    <Screen statusBarProps={{}}>
      <TextInput
        variant="outlined"
        placeholder={t(
          'home_screen.searchPlaceholder',
          'Search services that you need',
        )}
        value={search}
        onChange={handleChangeSearch}
        endAdornment={<Icon name="close" onPress={handleClearSearch} />}
        startAdornment={<Icon name="search" />}
        style={{
          marginLeft: 10,
          marginRight: 10,
          backgroundColor: '#fff',
          borderRadius: 20,
        }}
      />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 10,
        }}
      >
        <Carousel />

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
              }}
            >
              {t('home_screen.categoriesTitle', 'Categories')}
            </Text>
            <Button
              variant="text"
              size="large"
              color="secondary"
              title={t('home_screen.viewAll', 'View all')}
              onPress={() => navigation.navigate('AllCategories')}
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ height: 125, padding: 0, marginBottom: 10 }}
          >
            {categories.map((category, index) => (
              <CategoryCard
                key={index}
                title={category.name}
                icon={undefined}
              />
            ))}
          </ScrollView>
        </View>

        <View>
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
            {t('home_screen.featuredServices', 'Recommended for you')}
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {topRatedServices.map((service: any) => (
              <ServiceCard
                key={service.id}
                name={
                  service.name ||
                  t('home_screen.unnamedService', 'Unnamed Service')
                }
                price={`Q${service.price} por día`}
                rating={service.averageRating || 0}
                reviews={service.reviews?.length || 0}
                imageUrl={
                  service.urlImage
                    ? `https://dev.recolatam.com/api/v1${service.urlImage}`
                    : 'https://picsum.photos/200/300'
                }
                onPress={() =>
                  navigation.navigate('ServiceDetails', { id: service.id })
                }
              />
            ))}
          </ScrollView>
        </View>
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 15,
            }}
          >
            <Text
              variant="title"
              size="large"
              color="secondary"
              style={{
                textAlign: 'left',
                fontWeight: 'bold',
              }}
            >
              {t('home_screen.featureServices', 'Featured Services')}
            </Text>
            <Button
              variant="text"
              size="large"
              color="secondary"
              title={t('home_screen.viewAll', 'View all')}
              onPress={() => navigation.navigate('AllCategories')}
            />
          </View>

          <CategoryChipList
            categories={categories}
            onPress={(category) => {}}
          />
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
