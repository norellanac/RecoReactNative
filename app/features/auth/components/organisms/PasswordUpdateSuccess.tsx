import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Text, Button } from '../../../../components/atoms';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import SuccessImage from '../../../../assets/img/SuccessImage.png';

const PasswordUpdateSuccess: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleSubmit = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Image
        source={SuccessImage}
        style={styles.image}
        resizeMode="contain"
        accessibilityLabel="Ilustración de mujer sosteniendo un ícono de check"
      />
      <Text variant="headline" size="medium" color="info" style={styles.title}>
        {t('passwordReco.updateSuccess.title', 'Password Updated Successfully')}
      </Text>
      <Text variant="body" size="medium" color="secondary" style={styles.body}>
        {t(
          'passwordReco.updateSuccess.body',
          '¡Congratulations! Your password has been changed. Click continue to login.',
        )}
      </Text>
      <Button
        variant="filled"
        style={styles.button}
        onPress={handleSubmit}
        title={t('passwordReco.updateSuccess.CTAbutton', 'Continue to login')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
    padding: 32,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 24,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  body: {
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
  },
});

export default PasswordUpdateSuccess;
