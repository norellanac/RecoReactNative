import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Screen } from '../../../components/templates';
import { FavoritesStackParams } from './FavoritesStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text } from '../../../components/atoms';
import { FavoriteItem } from '../components/molecules/FavoriteItem';
import { useTranslation } from 'react-i18next';

type Props = NativeStackScreenProps<FavoritesStackParams, 'Favorites'>;

const mockFavorites = [
  { id: '1', title: 'Favorite Item 1', description: 'Description of item 1' },
  { id: '2', title: 'Favorite Item 2', description: 'Description of item 2' },
  { id: '3', title: 'Favorite Item 3', description: 'Description of item 3' },
  { id: '4', title: 'Favorite Item 4', description: 'Description of item 4' },
];

export const LandingFavorites = ({ navigation }: Props) => {
  const { t } = useTranslation();

  const renderFavoriteItem = ({
    item,
  }: {
    item: (typeof mockFavorites)[0];
  }) => (
    <FavoriteItem
      title={item.title}
      description={item.description}
      onPress={() => console.log(`Navigate to details of ${item.title}`)}
    />
  );

  return (
    <Screen statusBarProps={{}}>
      <View style={styles.container}>
        <Text style={styles.title}>{t('favorites.title', 'Favorites')}</Text>
        <FlatList
          data={mockFavorites}
          keyExtractor={(item) => item.id}
          renderItem={renderFavoriteItem}
          contentContainerStyle={styles.list}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  list: {
    flexGrow: 1,
  },
  favoriteItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  favoriteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  favoriteDescription: {
    fontSize: 14,
    color: '#666',
  },
});
