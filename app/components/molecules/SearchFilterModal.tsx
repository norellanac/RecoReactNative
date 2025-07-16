import React, { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  Modal,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { Text, Button } from '../atoms';
import { useProductServiceFilterData } from '@/app/hooks/useProductServiceFilterData';

const SearchFilterModal = ({ visible, onClose }) => {
  const {
    availableCategories,
    availableLocations,
    filters,
    updateCategories,
    updateLocationIds,
    resetFilters,
  } = useProductServiceFilterData();

  // Dropdown state
  const [catOpen, setCatOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [locOpen, setLocOpen] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState([]);

  // Format data for dropdown
  const categoryItems = availableCategories.map((cat) => ({
    label: cat.name,
    value: cat.id,
  }));
  const locationItems = availableLocations.map((loc) => ({
    label: loc.cityName,
    value: loc.id,
  }));

  const handleApply = () => {
    updateCategories(selectedCategories);
    updateLocationIds(selectedLocations);
    onClose();
  };

  const handleReset = () => {
    setSelectedCategories([]);
    setSelectedLocations([]);
    resetFilters();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <View style={styles.modalContainer}>
        <Text style={styles.title}>Filter</Text>
        <View style={styles.divider} />

        <Text style={styles.label}>Category</Text>
        <DropDownPicker
          open={catOpen}
          setOpen={setCatOpen}
          value={selectedCategories}
          setValue={setSelectedCategories}
          items={categoryItems}
          multiple={true}
          min={0}
          max={10}
          zIndex={2000}
          zIndexInverse={1000}
          placeholder="Select categories"
          searchable={true}
          searchPlaceholder="Buscar categoría..."
          searchTextInputStyle={{
            borderColor: '#7B61FF',
            borderWidth: 1,
            borderRadius: 12,
            color: '#222',
            paddingHorizontal: 10,
            fontSize: 15,
          }}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          badgeColors={['#7B61FF']}
          badgeDotColors={['#fff']}
          zIndex={1000}
          zIndexInverse={2000}
          renderBadgeItem={(item) => (
            <View
              style={{
                backgroundColor: '#7B61FF',
                borderRadius: 16,
                paddingHorizontal: 12,
                paddingVertical: 4,
                marginRight: 6,
                marginBottom: 4,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>
                {item.label}
              </Text>
            </View>
          )}
        />

        <Text variant="title" size="small" color="info" style={styles.label}>
          Location
        </Text>
        <DropDownPicker
          open={locOpen}
          setOpen={setLocOpen}
          value={selectedLocations}
          setValue={setSelectedLocations}
          items={locationItems}
          multiple={true}
          min={0}
          max={10}
          zIndex={1000}
          zIndexInverse={2000}
          searchable={true}
          placeholder="Select locations"
          searchPlaceholder="Buscar ubicación..."
          searchTextInputStyle={{
            borderColor: '#7B61FF',
            borderWidth: 1,
            borderRadius: 12,
            color: '#222',
            paddingHorizontal: 10,
            fontSize: 15,
          }}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          badgeColors={['#7B61FF']}
          badgeDotColors={['#fff']}
          renderBadgeItem={(item) => (
            <View
              style={{
                backgroundColor: '#7B61FF',
                borderRadius: 16,
                paddingHorizontal: 12,
                paddingVertical: 4,
                marginRight: 6,
                marginBottom: 4,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>
                {item.label}
              </Text>
            </View>
          )}
        />

        <View style={styles.buttonRow}>
          <Button
            variant="tonal"
            title="Reset"
            onPress={handleReset}
            style={styles.resetButton}
          />
          <Button
            variant="filled"
            title="Filter"
            onPress={handleApply}
            style={styles.filterButton}
          />
        </View>
        <Button
          variant="text"
          title="Close"
          onPress={onClose}
          style={styles.closeButton}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '60%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  dropdown: {
    marginBottom: 16,
    borderColor: '#7B61FF',
  },
  dropdownContainer: {
    borderColor: '#7B61FF',
    backgroundColor: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
  },
  resetButton: {
    flex: 1,
    marginRight: 8,
    borderRadius: 24,
    backgroundColor: '#E5D8FF',
  },
  filterButton: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 24,
    backgroundColor: '#7B61FF',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 24,
  },
});

export default SearchFilterModal;
