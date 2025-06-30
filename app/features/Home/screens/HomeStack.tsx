import React from 'react';
import { LandingHome } from './Landing';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AllCategories } from '../components/molecules/AllCategories';
import { AllServices } from '../../Services/screens';
import ServiceDetails from '../../Services/screens/ServiceDetails';
import TaskDetailsScreen from '../../Services/screens/TaskDetailsScreen';
import { ProductService } from '@/app/types/api/modelTypes';

export type HomeStackParams = {
  LandingHome: undefined;
  AllCategories: undefined;
  AllServices: undefined;
  ServiceDetails: { productService: ProductService };
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
      <HomeStack.Screen name="ServiceDetails" component={ServiceDetails} />
      <HomeStack.Screen name="TaskDetails" component={TaskDetailsScreen} />
    </HomeStack.Navigator>
  );
};
