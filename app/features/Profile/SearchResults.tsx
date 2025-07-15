import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { Text } from '@/app/components/atoms/Text';
import { Screen } from '@/app/components/templates/Screen';
import { useRoute } from '@react-navigation/native';
import { useProductServiceFilterData } from '@/app/hooks/useProductServiceFilterData';
import ServiceCard from '@/app/components/molecules/ServiceCard';
import SearchFilterModal from '@/app/components/molecules/SearchFilterModal';
import { SearchBar } from '@/app/components/molecules/SearchBar';
import { useTranslation } from 'react-i18next';

export const SearchResults = ({ navigation }) => {
  const { t } = useTranslation();
  const route = useRoute();
  const { query } = route.params;
  const [showFilterModal, setShowFilterModal] = useState(false);

  const {
    filteredServices,
    updateSearchTerm,
    // ...otros métodos de filtro
  } = useProductServiceFilterData();

  React.useEffect(() => {
    updateSearchTerm(query);
  }, [query]);

  return (
    <Screen
      statusBarProps={{
        showBackButton: true,
        title: (
          <Text
            variant="title"
            size="medium"
            color="info"
            style={{ marginTop: 8 }}
          >
            {t('search.searchResults', 'Search Results')}
          </Text>
        ),
        onLeftIconPress: () => navigation.goBack(),
      }}
    >
      <View style={{ flex: 1 }}>
        {/* Puedes reutilizar el SearchBar aquí si quieres permitir nueva búsqueda */}
        <SearchBar
          value={query}
          onChange={(text) => navigation.setParams({ query: text })}
          onSubmit={() => updateSearchTerm(query)}
          onClear={() => navigation.setParams({ query: '' })}
          onFilterPress={() => setShowFilterModal(true)}
          placeholder="Search services..."
        />
        <Text>
          {filteredServices.length
            ? `${filteredServices.length} results found`
            : 'No results found'}
        </Text>
        <FlatList
          data={filteredServices}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ServiceCard
              service={item}
              onPress={() =>
                navigation.navigate('ServiceDetails', { id: item.id })
              }
            />
          )}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <Text>No results found for "{query}"</Text>
              {/* Aquí puedes poner tu ilustración de "Not Found" */}
            </View>
          }
        />
        <SearchFilterModal
          visible={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          // Pasa los props necesarios para filtros
        />
      </View>
    </Screen>
  );
};
