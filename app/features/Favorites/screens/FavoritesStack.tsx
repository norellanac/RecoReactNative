import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LandingFavorites } from './Landing';
import ServiceDetails from '../../Services/screens/ServiceDetails';
import TaskDetailsScreen from '../../Services/screens/TaskDetailsScreen';
import { ProductService } from '@/app/types/api/modelTypes';

export type FavoritesStackParams = {
  FavoritesList: undefined;
  ServiceDetails: { productService: ProductService };
  TaskDetails: {
    service: ProductService;
    dateTime: string;
    imageUrl?: string;
  };
};

const FavoritesStack = createNativeStackNavigator<FavoritesStackParams>();

export const FavoritesNavigation = () => {
  return (
    <FavoritesStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="FavoritesList"
    >
      <FavoritesStack.Screen name="FavoritesList" component={LandingFavorites} />
      <FavoritesStack.Screen name="ServiceDetails" component={ServiceDetails} />
      <FavoritesStack.Screen name="TaskDetails" component={TaskDetailsScreen} />
    </FavoritesStack.Navigator>
  );
};
