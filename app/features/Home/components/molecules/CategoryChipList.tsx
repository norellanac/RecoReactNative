import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Button } from '@/app/components/atoms';

type CategoryChipListProps = {
  categories: { id: string | number; name: string }[];
  onPress?: (category: { id: string | number; name: string }) => void;
};

export default function CategoryChipList({
  categories,
  onPress,
}: CategoryChipListProps) {
  const topCategories = categories.slice(0, 5);
  return (
    <View style={styles.container}>
      <FlatList
        data={topCategories}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <Button
            variant="outlined"
            title={item.name}
            onPress={() => onPress?.(item)}
            style={styles.chip}
            textStyle={styles.chipText}
          />
        )}
        nestedScrollEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  row: {
    flex: 1,
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  chip: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 16,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  chipText: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});
