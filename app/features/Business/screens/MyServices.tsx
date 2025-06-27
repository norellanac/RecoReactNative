import React, { useMemo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, Button } from '@/app/components/atoms';
import { Icon } from '@/app/components/atoms/Icon';
import { useGetProductsQuery } from '@/app/services/productApi';
import { useSelector } from 'react-redux';
import { selectAuth } from '@/app/redux/slices/authSlice';
import ServiceCard from '@/app/components/molecules/ServiceCard';

const MyServices = ({ navigation, onRegisterService }) => {
  const { user } = useSelector(selectAuth);
  const userId = user?.id;
  const { data, isLoading } = useGetProductsQuery();
  const allProducts = Array.isArray(data?.data?.items) ? data.data.items : [];
  const myProducts = useMemo(
    () => allProducts.filter((product) => product.userId === userId),
    [allProducts, userId],
  );

  return (
    <ScrollView contentContainerStyle={styles.productsContainer}>
      <Text variant="body" size="medium" style={styles.description}>
        Aquí puedes revisar y editar la información de tus servicios.
      </Text>
      {myProducts.length === 0 && !isLoading ? (
        <Text style={styles.emptyText}>No tienes productos registrados.</Text>
      ) : (
        myProducts.map((product) => (
          <ServiceCard
            key={product.id}
            service={product}
            onPress={() => navigation.navigate('MyServiceDetails', { product })}
            showProvider={false}
            showBookmark={false}
            rightAction={
              <Icon
                name="pencil"
                family="MaterialCommunityIcons"
                size={25}
                color="#7B61FF"
                onPress={() =>
                  navigation.navigate('MyServiceDetails', { product })
                }
              />
            }
          />
        ))
      )}
      <Button
        title="Registrar nuevo servicio"
        variant="filled"
        style={styles.addButton}
        onPress={onRegisterService}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  productsContainer: {
    padding: 16,
    alignItems: 'stretch',
  },
  description: {
    color: '#666',
    marginBottom: 16,
    textAlign: 'left',
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 40,
    color: '#888',
  },
  addButton: {
    marginTop: 24,
    alignSelf: 'center',
    width: '90%',
  },
});

export default MyServices;
