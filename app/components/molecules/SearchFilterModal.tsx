import React, { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  Modal,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, Button } from '../atoms';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCategories,
  setLocationIds,
  resetFilters,
} from '@/app/redux/slices/filterProductsSlice';
import { useProductServiceFilterData } from '@/app/hooks/useProductServiceFilterData';
import { useTranslation } from 'react-i18next';

const SearchFilterModal = ({ visible, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [localCategories, setLocalCategories] = useState([]);
  const [localLocations, setLocalLocations] = useState([]);

  React.useEffect(() => {
    if (visible) {
      setLocalCategories(
        Array.isArray(selectedCategories) ? selectedCategories : [],
      );
      setLocalLocations(
        Array.isArray(selectedLocations) ? selectedLocations : [],
      );
    }
  }, [visible, selectedCategories, selectedLocations]);

  // Lee los filtros actuales de Redux
  const selectedCategories = useSelector(
    (state) => state.filter.options.categories,
  );
  const selectedLocations = useSelector(
    (state) => state.filter.options.locationIds,
  );

  const { availableLocations, availableCategories } =
    useProductServiceFilterData();

  // Dropdown state (solo para abrir/cerrar)
  const [catOpen, setCatOpen] = useState(false);
  const [locOpen, setLocOpen] = useState(false);

  // Formatea los datos para el dropdown
  const categoryItems = availableCategories.map((cat) => ({
    label: cat.name,
    value: cat.id,
  }));
  const locationItems = availableLocations.map((loc) => ({
    label: loc.cityName,
    value: loc.id,
  }));

  const handleApply = () => {
    dispatch(setCategories(localCategories));
    dispatch(setLocationIds(localLocations));
    onClose();
  };

  const handleReset = () => {
    setLocalCategories([]);
    setLocalLocations([]);
    dispatch(resetFilters());
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
        <Text variant="title" size="large" color="primary" style={styles.title}>
          {t('searchFilterModal.title', 'Filter')}
        </Text>
        <View style={styles.divider} />

        <Text variant="title" size="small" color="info" style={styles.label}>
          Category
        </Text>
        <DropDownPicker
          open={catOpen}
          setOpen={setCatOpen}
          value={localCategories}
          setValue={setLocalCategories}
          items={categoryItems}
          multiple={true}
          mode="BADGE"
          min={0}
          max={5}
          zIndex={2000}
          zIndexInverse={1000}
          placeholder={t(
            'searchFilterModal.selectCategories',
            'Select categories',
          )}
          searchable={true}
          searchPlaceholder={t(
            'searchFilterModal.searchCategory',
            'Search category...',
          )}
          searchTextInputStyle={styles.searchTextInput}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          renderBadgeItem={(item) => (
            <View style={styles.dropdownBadgeItem}>
              <Text variant="body" size="small" style={styles.badgeText}>
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
          value={localLocations}
          setValue={setLocalLocations}
          items={locationItems}
          multiple={true}
          mode="BADGE"
          min={0}
          max={5}
          zIndex={1000}
          zIndexInverse={2000}
          searchable={true}
          placeholder={t(
            'searchFilterModal.selectLocations',
            'Select locations',
          )}
          searchPlaceholder={t(
            'searchFilterModal.searchLocation',
            'Search location...',
          )}
          searchTextInputStyle={styles.searchTextInput}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          renderBadgeItem={(item) => (
            <View style={styles.dropdownBadgeItem}>
              <Text variant="body" size="small" style={styles.badgeText}>
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
            title="Apply"
            onPress={handleApply}
            style={styles.filterButton}
          />
        </View>
        <Ionicons
          name="close"
          size={28}
          color="#6750A4"
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
    height: '65%',
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
  searchTextInput: {
    borderColor: '#79747E',
    borderWidth: 1,
    borderRadius: 8,
    color: '#222',
    paddingHorizontal: 10,
    fontSize: 15,
  },
  dropdownBadgeItem: {
    backgroundColor: '#7B61FF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
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
  },
  filterButton: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 24,
  },
});

export default SearchFilterModal;
