import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text } from '@/app/components/atoms';
import { useTranslation } from 'react-i18next';
import congratsImage from '@/app/assets/img/stepper/step6_congratsImage.png'; // Usa PNG/JPG, o adapta si tienes SVG
import { useNavigation } from '@react-navigation/native';

const Step6 = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleFinish = () => {
    navigation.navigate('Profile');
  };

  return (
    <View style={styles.container}>
      <Image
        source={congratsImage}
        style={styles.image}
        resizeMode="contain"
        accessible
        accessibilityLabel="Congratulations illustration"
      />
      <Text
        variant="headline"
        size="small"
        color="primary"
        style={styles.heading}
      >
        {t('businessStepper.step6.heading', 'Congratulations!')}
      </Text>
      <Text
        variant="title"
        size="medium"
        color="secondary"
        style={styles.description}
      >
        {t(
          'businessStepper.step6.description',
          'You have completed your business profile.',
        )}
      </Text>
      <View style={styles.divider} />
      <Text variant="label" size="large" color="secondary" style={styles.tip}>
        {t(
          'businessStepper.step6.tip',
          'Tip: You can edit your profile at any time.',
        )}
      </Text>
      <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
        <Text style={styles.finishButtonText}>
          {t('businessStepper.step6.ctaBottom', 'Go to my profile')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: 140,
    height: 140,
    marginBottom: 24,
  },
  heading: {
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    marginBottom: 16,
    textAlign: 'center',
  },
  divider: {
    width: '20%',
    height: 2,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
    borderRadius: 1,
  },
  tip: {
    color: '#888',
    marginBottom: 32,
    textAlign: 'center',
  },
  finishButton: {
    backgroundColor: '#7B61FF',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
  },
  finishButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Step6;
