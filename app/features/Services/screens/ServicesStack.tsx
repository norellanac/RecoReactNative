import React from 'react';
import AllServices from './AllServices';
import ServiceDetails from './ServiceDetails';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type ServicesStackParams = {
  AllServices: undefined;
  ServiceDetails: { serviceId: number };
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
    </ServicesStack.Navigator>
  );
};

export default ServicesStackNavigation;
