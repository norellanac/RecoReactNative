import React from 'react';
import { View } from 'react-native';
import { Screen } from '../../../components/templates';
import Step1 from '../steps/Step1';
import Step2 from '../steps/Step2';
import Step3 from '../steps/Step3';
import Step4 from '../steps/Step4';
import Step5 from '../steps/Step5';
import Step6 from '../steps/Step6';
import { useAppSelector } from '@/app/hooks/useAppSelector';
import { selectStepper } from '@/app/redux/slices/serviceStepperSlice';
import { useNavigation } from '@react-navigation/native';

const STEPS = [Step1, Step2, Step3, Step4, Step5, Step6];

export const BusinessStepperScreen = () => {
  const { currentStep } = useAppSelector(selectStepper);
  const StepComponent = STEPS[currentStep];
  const navigation = useNavigation();

  return (
    <Screen
      statusBarProps={{
        showBackButton: true,
        onLeftIconPress: () => navigation.goBack('Profile'),
      }}
    >
      <View style={{ flex: 1 }}>
        <StepComponent />
      </View>
    </Screen>
  );
};
