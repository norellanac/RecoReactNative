import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Text, Button } from '@/app/components/atoms';
import { useTranslation } from 'react-i18next';
import { getApiImageUrl } from '@/app/utils/Environment';
import { Category } from '@/app/types/api/modelTypes';

interface CategoryListProps {
  categories: Category[];
  onCategoryPress: (category: Category) => void;
  onViewAll: () => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  onCategoryPress,
  onViewAll,
}) => {
  const { t } = useTranslation();

  const displayCategories = categories.slice(0, 5);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text
          variant="title"
          size="large"
          color="secondary"
          style={{
            textAlign: 'left',
            fontWeight: 'bold',
          }}
        >
          {t('home_screen.categoriesTitle', 'Categories')}
        </Text>

        <Button
          variant="text"
          size="large"
          title={t('home_screen.viewAll', 'View all')}
          onPress={onViewAll}
        />
      </View>

      <View style={styles.grid}>
        {displayCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.item}
            onPress={() => onCategoryPress(category)}
          >
            <View style={styles.iconCircle}>
              {category.icon ? (
                <Image
                  source={getApiImageUrl(category.icon)}
                  style={styles.icon}
                  resizeMode="contain"
                />
              ) : null}
            </View>
            <Text variant="body" size="small" style={styles.itemText}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
        {categories.length > 5 && (
          <TouchableOpacity style={styles.item} onPress={onViewAll}>
            <View style={styles.iconCircle}>
              <Text variant="headline" size="large" style={styles.moreText}>
                +
              </Text>
            </View>
            <Text variant="body" size="medium" style={styles.itemText}>
              {t('home_screen.moreButton', 'More')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    paddingHorizontal: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircle: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: '#F5F3FF', // Fondo suave
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  icon: {
    width: 24,
    height: 24,
  },
  itemText: {
    textAlign: 'center',
  },
  moreText: {
    color: '#7B61FF',
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  item: {
    width: '30%', // Para 3 columnas
    alignItems: 'center',
    marginBottom: 18,
  },
});

export default CategoryList;
