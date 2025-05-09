import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Image } from 'react-native';
import { Screen } from '../../../../components/templates';
import { Text } from '../../../../components/atoms/Text';
import { useGetCategoriesQuery } from '@/app/services/categoryApi';
import { useTranslation } from 'react-i18next';

export const AllCategories = ({ navigation }: { navigation: any }) => {
  const { t } = useTranslation();
  const { data: categoriesData, isLoading, isError } = useGetCategoriesQuery();

  const categories = categoriesData?.data || [];

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

  const renderCategory = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.categoryItem}>
      <View style={styles.iconContainer}>
        {item.icon && (
          <Image
            source={{ uri: item.icon }}
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
        onLeftIconPress: () => navigation.goBack(),
      }}
    >
      <Text
        variant="headline"
        size="small"
        color="info"
        style={{
          textAlign: 'left',
          padding: 10,
          paddingLeft: 20,
          marginVertical: 10,
          backgroundColor: '#E7E0EC',
        }}
      >
        {t('home_screen.all_categories', 'All Categories')}
      </Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCategory}
        numColumns={2}
        columnWrapperStyle={styles.row}
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
    padding: 10,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  categoryItem: {
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    paddingBottom: 20,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8DEF8',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: {
    width: 30,
    height: 30,
  },
  categoryText: {
    fontWeight: 'bold',
  },
});
