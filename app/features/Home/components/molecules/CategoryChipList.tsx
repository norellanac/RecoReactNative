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
      <View style={styles.rowWrap}>
        {topCategories.map((item) => (
          <Button
            key={item.id}
            variant="outlined"
            title={item.name}
            onPress={() => onPress?.(item)}
            style={styles.chip}
            textStyle={styles.chipText}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  chip: {
    flexBasis: '48%',
    marginBottom: 12,
    borderRadius: 16,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 2,
  },
  chipText: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    padding: 8,
  },
});
