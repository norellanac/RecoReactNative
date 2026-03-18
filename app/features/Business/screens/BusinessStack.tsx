import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BusinessProfileScreen from '@/app/features/Business/screens/BusinessProfileScreen';
import { BusinessStepperScreen } from '@/app/features/Business/screens/BusinessStepperScreen';
import MyServiceDetails from './MyServiceDetails';

export type BusinessStackParams = {
  MyServices: undefined;
  BusinessStepper: undefined;
  MyServiceDetails: { product: any }; // <-- agrega el parámetro
};

const Stack = createNativeStackNavigator<BusinessStackParams>();

export const BusinessNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="MyServices"
    >
      <Stack.Screen name="MyServices" component={BusinessProfileScreen} />
      <Stack.Screen name="BusinessStepper" component={BusinessStepperScreen} />
      <Stack.Screen name="MyServiceDetails" component={MyServiceDetails} />
    </Stack.Navigator>
  );
};
