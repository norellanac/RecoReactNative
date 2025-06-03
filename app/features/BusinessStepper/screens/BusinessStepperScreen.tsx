import React, { useState } from 'react';
import { View, Button } from 'react-native';
import { Screen } from '../../../components/templates';
import Step1 from '../steps/Step1';
import Step2 from '../steps/Step2';
import Step3 from '../steps/Step3';
import Step4 from '../steps/Step4';
import Step5 from '../steps/Step5';
import Step6 from '../steps/Step6';
import { useAppSelector } from '@/app/hooks/useAppSelector';
import { selectStepper } from '@/app/redux/slices/serviceStepperSlice';
import { StepperIndicator } from '@/app/features/BusinessStepper/steps/StepperIndicator';

const STEPS = [Step1, Step2, Step3, Step4, Step5, Step6];

export const BusinessStepperScreen = () => {
  //const [currentStep, setCurrentStep] = useState(0);
  //const StepComponent = STEPS[currentStep];
  const { currentStep } = useAppSelector(selectStepper);
  const StepComponent = STEPS[currentStep];

  return (
    <Screen
      statusBarProps={{
        showBackButton: true,
        onLeftIconPress: () => navigation.goBack(''),
      }}
    >
      <View style={{ flex: 1 }}>
        {/* <StepperIndicator currentStep={currentStep} totalSteps={STEPS.length} /> */}
        <StepComponent />
        {/* <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: 16,
          }}
        >
          <Button
            title="Anterior"
            onPress={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
            disabled={currentStep === 0}
          />
          <Button
            title={currentStep === STEPS.length - 1 ? 'Finalizar' : 'Siguiente'}
            onPress={() =>
              setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1))
            }
          />
        </View> */}
      </View>
    </Screen>
  );
};
