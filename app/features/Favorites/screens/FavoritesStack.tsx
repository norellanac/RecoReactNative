import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LandingFavorites } from './Landing';

export type FavoritesStackParams = {
  Favorites: undefined;
};

const FavoritesStack = createNativeStackNavigator<FavoritesStackParams>();

export const FavoritesNavigation = () => {
  return (
    <FavoritesStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Favorites"
    >
      <FavoritesStack.Screen name="Favorites" component={LandingFavorites} />
    </FavoritesStack.Navigator>
  );
};
