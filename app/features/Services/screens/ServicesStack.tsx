import React from 'react';
import AllServices from './AllServices';
import ServiceDetails from './ServiceDetails';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProductService } from '@/app/types/api/modelTypes';
import TaskDetailsScreen from './TaskDetailsScreen';

export type ServicesStackParams = {
  AllServices: undefined;
  ServiceDetails: { productService: ProductService };
  TaskDetails: {
    service: ProductService;
    dateTime: string;
    imageUrl?: string;
  };
};

const ServicesStack = createNativeStackNavigator<ServicesStackParams>();

export const ServicesStackNavigation = () => {
  return (
    <ServicesStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="AllServices"
    >
      <ServicesStack.Screen name="AllServices" component={AllServices} />
      <ServicesStack.Screen name="ServiceDetails" component={ServiceDetails} />
      <ServicesStack.Screen name="TaskDetails" component={TaskDetailsScreen} />
    </ServicesStack.Navigator>
  );
};

export default ServicesStackNavigation;
