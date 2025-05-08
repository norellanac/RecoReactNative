import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Button, Text } from '../../../components/atoms';
import { useTranslation } from 'react-i18next';

export const ProfileOptions = ({
  navigation,
  user,
}: {
  navigation: any;
  user: any;
}) => {
  const { t } = useTranslation();

  const options = [
    {
      key: 'email',
      label: t('userProfile.email', 'Email'),
      value: user?.email || 'email@example.com',
      onPress: null, // No acción para el email
    },
    {
      key: 'changePassword',
      label: t('userProfile.changePassword', 'Change password'),
      value: '',
      onPress: () => navigation.navigate('PasswordRecovery'), // Navegar a la pantalla de recuperación de contraseña
    },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        data={options}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listItem}
            onPress={item.onPress}
            disabled={!item.onPress} // Deshabilitar si no hay acción
          >
            <Text style={styles.label}>{item.label}</Text>
            {item.value ? (
              <Text style={styles.value}>{item.value}</Text>
            ) : (
              <Text style={styles.arrow}>{'>'}</Text> // Flecha para opciones navegables
            )}
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 20,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    color: '#666',
  },
  arrow: {
    fontSize: 16,
    color: '#666',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgb(226, 226, 230)',
  },
});
