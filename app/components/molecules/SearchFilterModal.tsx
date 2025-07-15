import React from 'react';
import { Modal, View, Text, Button } from 'react-native';
import { useProductsServiceFilters } from '@/app/hooks/useProductsServiceFilters';

const SearchFilterModal = ({ visible, onClose }) => {
  const {
    filters,
    updateCategories,
    updatePriceRange,
    updateMinRating,
    resetFilters,
    // ...otros métodos
  } = useProductsServiceFilters();

  // Aquí renderizas los controles de filtro (categorías, sliders, ratings, etc.)

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, padding: 20 }}>
        <Text>Filter</Text>
        {/* Controles de filtro aquí */}
        <Button title="Reset" onPress={resetFilters} />
        <Button title="Apply" onPress={onClose} />
      </View>
    </Modal>
  );
};

export default SearchFilterModal;
