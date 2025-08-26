import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Image } from 'react-native';
import { Screen } from '../../../../components/templates';
import { Text } from '../../../../components/atoms/Text';
import { useGetCategoriesQuery } from '@/app/services/categoryApi';
import { useTranslation } from 'react-i18next';
import { getApiImageUrl } from '@/app/utils/Environment';
import { Category } from '@/app/types/api/modelTypes';

interface AllCategoriesProps {
  navigation: {
    goBack: () => void;
    navigate: (screen: string, params?: any) => void;
  };
}

export const AllCategories: React.FC<AllCategoriesProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { data: categoriesData, isLoading, isError } = useGetCategoriesQuery();

  const categories: Category[] = categoriesData?.data || [];

  if (isLoading) {
    return (
      <Text style={styles.loading}>
        {t('home_screen.loading', 'Loading categories...')}
      </Text>
    );
  }

  if (isError) {
    return (
      <Text style={styles.error}>
        {t('home_screen.error', 'An error occurred while loading categories.')}
      </Text>
    );
  }

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() =>
        navigation.navigate('CategoryServices', {
          categoryId: item.id,
          categoryName: item.name,
        })
      }
    >
      <View style={styles.iconContainer}>
        {item.icon && (
          <Image
            source={getApiImageUrl(item.icon)}
            style={styles.iconImage}
            resizeMode="contain"
          />
        )}
      </View>
      <Text
        variant="body"
        size="small"
        color="secondary"
        style={styles.categoryText}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Screen
      statusBarProps={{
        showBackButton: true,
        title: (
          <Text variant="title" size="medium" color="info">
            {t('home_screen.all_categories', 'All Categories')}
          </Text>
        ),
        onLeftIconPress: () => navigation.goBack(),
      }}
    >
      <FlatList<Category>
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCategory}
        numColumns={3}
        contentContainerStyle={styles.list}
      />
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
  list: {
    paddingTop: 24,
    padding: 10,
  },
  categoryItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    paddingBottom: 16,
    maxWidth: '33%',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8DEF8',
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: {
    width: 22,
    height: 22,
  },
  categoryText: {
    fontWeight: 'bold',
    textAlign: 'center',
    maxWidth: 100,
  },
});
