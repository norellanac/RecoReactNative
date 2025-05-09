import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Text } from '../../../components/atoms';
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
      label: t('userProfile.account', 'Account'),
      value: user?.email || 'email@example.com',
      onPress: null,
    },
    {
      key: 'changePassword',
      label: t('userProfile.changePassword', 'Change password'),
      value: '',
      onPress: () => navigation.navigate(''),
    },
    {
      key: 'changeLanguage',
      label: t('userProfile.changeLanguage', 'Change language'),
      value: '',
      onPress: () => navigation.navigate('ChangeLanguage'),
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
            <Text variant="title" size="medium" color="secondary">
              {item.label}
            </Text>
            {item.value ? (
              <Text
                variant="title"
                size="medium"
                color="primary"
                style={styles.value}
              >
                {item.value}
              </Text>
            ) : (
              <AntDesign name="rightcircleo" size={24} color="#6750A4" />
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
    //backgroundColor: '#fff',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgb(226, 226, 230)',
  },
});
