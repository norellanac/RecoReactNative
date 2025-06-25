import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Button } from '@/app/components/atoms';
import { MaterialIcons } from '@expo/vector-icons'; // O usa 'react-native-vector-icons/MaterialIcons'
import { useAppDispatch } from '@/app/hooks/useAppDispatch';
import { useAppSelector } from '@/app/hooks/useAppSelector';
import {
  selectStepper,
  setCurrentStep,
} from '@/app/redux/slices/serviceStepperSlice';

interface CustomStepperProps {
  isNextEnabled?: boolean;
  onHandleNext: () => void | Promise<void>;
  totalSteps?: number;
}

const { width } = Dimensions.get('window');

const CustomStepper: React.FC<CustomStepperProps> = ({
  isNextEnabled = false,
  onHandleNext,
  totalSteps = 6,
}) => {
  const dispatch = useAppDispatch();
  const { currentStep } = useAppSelector(selectStepper);

  const handleNextStep = () => {
    onHandleNext();
    if (currentStep < totalSteps - 1) {
      dispatch(setCurrentStep(currentStep + 1));
    }
  };

  const handleBackStep = () => {
    if (currentStep > 0) {
      dispatch(setCurrentStep(currentStep - 1));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.stepperRow}>
        {Array.from({ length: totalSteps }).map((_, idx) => (
          <React.Fragment key={idx}>
            <View style={styles.stepContainer}>
              <View
                style={[
                  styles.circle,
                  idx < currentStep
                    ? styles.circleCompleted
                    : idx === currentStep
                      ? styles.circleActive
                      : styles.circleInactive,
                ]}
              >
                {idx < currentStep ? (
                  <MaterialIcons name="check" size={24} color="#fff" />
                ) : (
                  <Text
                    variant="body"
                    size="large"
                    color="gray"
                    style={[
                      styles.stepText,
                      idx === currentStep && styles.stepTextActive,
                    ]}
                  >
                    {idx + 1}
                  </Text>
                )}
              </View>
            </View>
            {idx < totalSteps - 1 && (
              <View
                style={[
                  styles.line,
                  idx < currentStep - 1
                    ? styles.lineCompleted
                    : styles.lineInactive,
                ]}
              />
            )}
          </React.Fragment>
        ))}
      </View>
      <View style={styles.buttonRow}>
        <Button
          variant="filled"
          title="Back"
          style={[styles.button, currentStep === 0 && styles.buttonDisabled]}
          onPress={handleBackStep}
          disabled={currentStep === 0}
        ></Button>
        <Button
          variant="filled"
          title={currentStep === totalSteps - 1 ? 'Finish' : 'Next'}
          style={[styles.button, !isNextEnabled && styles.buttonDisabled]}
          onPress={handleNextStep}
          disabled={!isNextEnabled}
        ></Button>
      </View>
    </View>
  );
};

const CIRCLE_SIZE = 35;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: 24,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3ECFF',
    alignItems: 'center',
    width: width,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    width: '100%',
  },
  stepContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 30,
    minWidth: 30,
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E0E0E0',
  },
  circleActive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#6750A4',
  },
  circleCompleted: {
    backgroundColor: '#6750A4',
  },
  circleInactive: {
    backgroundColor: '#F0F0F0',
  },
  stepText: {
    color: 'gray',
    fontWeight: 'bold',
  },
  stepTextActive: {
    color: '#6750A4',
  },
  line: {
    width: 30,
    height: 2,
    marginHorizontal: 3,
  },
  lineCompleted: {
    backgroundColor: '#6750A4',
  },
  lineInactive: {
    backgroundColor: '#E0E0E0',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  button: {
    backgroundColor: '#6750A4',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    alignItems: 'center',
    minWidth: 120,
    marginHorizontal: 8,
    shadowColor: '#6750A4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default CustomStepper;
