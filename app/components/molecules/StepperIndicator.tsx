import React from 'react';
import { View, StyleSheet } from 'react-native';

export const StepperIndicator = ({ currentStep, totalSteps }) => (
  <View style={styles.container}>
    {Array.from({ length: totalSteps }).map((_, idx) => (
      <View
        key={idx}
        style={[
          styles.dot,
          idx === currentStep ? styles.activeDot : styles.inactiveDot,
        ]}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 50,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    margin: 4,
  },
  activeDot: {
    backgroundColor: '#7B61FF',
  },
  inactiveDot: {
    backgroundColor: '#E0E0E0',
  },
});
