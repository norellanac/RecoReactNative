import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Screen } from '../../../components/templates';
import { FavoritesStackParams } from './FavoritesStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, Button } from '../../../components/atoms';
import { Icon } from '@/app/components/atoms/Icon';
import ServiceCard from '@/app/components/molecules/ServiceCard';
import { useTranslation } from 'react-i18next';
import {
  selectFavorites,
  toggleFavorite,
  selectIsFavorite,
} from '@/app/redux/slices/favoritesSlice';

type Props = NativeStackScreenProps<FavoritesStackParams, 'FavoritesList'>;

const FavoriteItem = ({ item, navigation }: { item: any; navigation: any }) => {
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

export const LandingFavorites = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const favoriteServices = useSelector(selectFavorites);

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
            {t('favorites.title', 'My favorites')}
          </Text>
        ),
      }}
    >
      <View style={styles.container}>
        {favoriteServices.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon
              name="heart-broken"
              family="MaterialCommunityIcons"
              size={75}
              color="#ccc"
            />
            <Text
              variant="body"
              size="large"
              color="info"
              style={styles.emptyText}
            >
              {t('favorites.empty', 'No favorites yet')}
            </Text>
            <Text
              variant="body"
              size="medium"
              color="secondary"
              style={styles.emptySubtext}
            >
              {t(
                'favorites.emptyDescription',
                'Add services to your favorites to see them here.',
              )}
            </Text>
            <Button
              title={t('favorites.addFirst', 'Add your first favorite')}
              variant="filled"
              style={styles.button}
              onPress={() => navigation.navigate('AllServices')}
            />
          </View>
        ) : (
          <FlatList
            data={favoriteServices}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <FavoriteItem item={item} navigation={navigation} />
            )}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: -80,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
  emptySubtext: {
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    width: '80%',
  },
  list: {
    paddingBottom: 24,
  },
});
