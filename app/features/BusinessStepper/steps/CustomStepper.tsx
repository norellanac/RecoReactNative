import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Text, Button, Icon } from '@/app/components/atoms';
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
        <TouchableOpacity
          style={[styles.button, currentStep === 0 && styles.buttonDisabled]}
          onPress={handleBackStep}
          disabled={currentStep === 0}
        >
          <Text style={styles.buttonText}>BACK</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, !isNextEnabled && styles.buttonDisabled]}
          onPress={handleNextStep}
          disabled={!isNextEnabled}
        >
          <Text style={styles.buttonText}>
            {currentStep === totalSteps - 1 ? 'FINISH' : 'NEXT'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const CIRCLE_SIZE = 40;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: 24,
    paddingBottom: 24,
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
    backgroundColor: '#white',
    borderWidth: 2,
    borderColor: '#7B61FF',
  },
  circleCompleted: {
    backgroundColor: '#7B61FF',
  },
  circleInactive: {
    backgroundColor: '#F0F0F0',
  },
  stepText: {
    color: 'gray',
    fontWeight: 'bold',
    fontSize: 18,
  },
  stepTextActive: {
    color: '#7B61FF',
  },
  line: {
    width: 32,
    height: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 2,
  },
  lineCompleted: {
    backgroundColor: '#7B61FF',
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
    backgroundColor: '#7B61FF',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    alignItems: 'center',
    minWidth: 120,
    marginHorizontal: 8,
    shadowColor: '#7B61FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 24,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default CustomStepper;
