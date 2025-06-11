import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Button } from '@/app/components/atoms';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const EmptyState = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const handleSearch = () => {
    navigation.navigate('AllServices');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('@/app/assets/img/empty-tasks.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text variant="headline" size="small" color="info" style={styles.title}>
        {t('tasks.emptyTitle', 'No tasks are currently available')}
      </Text>
      <Text
        variant="title"
        size="medium"
        color="secondary"
        style={styles.subtitle}
      >
        {t(
          'tasks.emptySubtitle',
          'Let us help you get the job done.\nBook a task and see it here.',
        )}
      </Text>
      <Button
        title={t('tasks.searchTasker', 'Search a Tasker')}
        variant="outlined"
        style={styles.button}
        onPress={handleSearch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 32,
    paddingTop: -64,
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    width: 120,
    height: 100,
    marginBottom: 32,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: 320,
  },
});

export default EmptyState;
