import React from 'react';
import { LandingHome } from './Landing';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AllCategories } from '../components/molecules/AllCategories';
import { AllServices } from '../../Services/screens';
import ServiceDetails from '../../Services/screens/ServiceDetails';
import TaskDetailsScreen from '../../Services/screens/TaskDetailsScreen';
import { ProductService } from '@/app/types/api/modelTypes';
import { SearchResults } from '@/app/features/Search/screens/SearchResults';
import CategoryServices from '../../Services/screens/CategoryServices';

export type HomeStackParams = {
  LandingHome: undefined;
  AllCategories: undefined;
  AllServices: undefined;
  CategoryServices: { categoryId: number; categoryName: string };
  ServiceDetails: { productService: ProductService };
  SearchResults: { query: string };
  TaskDetails: {
    service: ProductService;
    dateTime: string;
    imageUrl?: string;
  };
};

const HomeStack = createNativeStackNavigator<HomeStackParams>();

export const HomeNavigation = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="LandingHome"
    >
      <HomeStack.Screen name="LandingHome" component={LandingHome} />
      <HomeStack.Screen name="AllCategories" component={AllCategories} />
      <HomeStack.Screen name="AllServices" component={AllServices} />
      <HomeStack.Screen name="CategoryServices" component={CategoryServices} />
      <HomeStack.Screen name="ServiceDetails" component={ServiceDetails} />
      <HomeStack.Screen name="TaskDetails" component={TaskDetailsScreen} />
      <HomeStack.Screen name="SearchResults" component={SearchResults} />
    </HomeStack.Navigator>
  );
};
