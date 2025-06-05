import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Text } from '@/app/components/atoms';
import { useTranslation } from 'react-i18next';
import { useGetCategoriesQuery } from '@/app/services/categoryApi';
import { useUpdateProductMutation } from '@/app/services/productApi';
import { useAppDispatch } from '@/app/hooks/useAppDispatch';
import { useAppSelector } from '@/app/hooks/useAppSelector';
import {
  selectStepper,
  setServiceState,
} from '@/app/redux/slices/serviceStepperSlice';
import CustomStepper from './CustomStepper';

const Step2 = ({ onNext }: { onNext?: () => void }) => {
  const { t } = useTranslation();
  const { data, isLoading, error } = useGetCategoriesQuery();
  const categories = data?.data || [];
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const dispatch = useAppDispatch();
  const { service } = useAppSelector(selectStepper);

  const handleSelectCategory = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId],
    );
  };

  const handleSubmitCategories = async () => {
    try {
      const responseUpdateProduct = await updateProduct({
        productId: service?.id,
        productData: {
          type: 1,
          categories: selectedCategories,
        },
      }).unwrap();
      if (responseUpdateProduct.success) {
        dispatch(setServiceState(responseUpdateProduct?.productService));
        if (onNext) onNext();
      }
    } catch (err) {
      // Manejo de error si lo necesitas
    }
  };

  const isNextEnabled = selectedCategories.length > 0 && !isUpdating;

  if (isLoading) return <ActivityIndicator style={{ marginTop: 40 }} />;
  if (error)
    return (
      <Text
        variant="body"
        size="medium"
        color="error"
        style={{ marginTop: 40 }}
      >
        {t('APIs.categories.error', 'Error loading categories')}
      </Text>
    );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text variant="title" size="medium" color="info" style={styles.heading}>
          {t('businessStepper.step1.step2', 'Step 2')}
        </Text>
        <Text variant="headline" size="small" color="info" style={styles.title}>
          {t(
            'businessStepper.step2.title',
            'What best describes your business?',
          )}
        </Text>
        <Text
          variant="title"
          size="small"
          color="secondary"
          style={styles.description}
        >
          {t(
            'businessStepper.step2.description',
            'Choose one or more categories',
          )}
        </Text>

        <ScrollView contentContainerStyle={styles.categoriesContainer}>
          {categories.map((category: any) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryCard,
                selectedCategories.includes(category.id) &&
                  styles.categoryCardSelected,
              ]}
              onPress={() => handleSelectCategory(category.id)}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: category.icon }}
                style={styles.categoryIcon}
                resizeMode="contain"
              />
              <Text
                variant="body"
                size="medium"
                color="secondary"
                style={styles.categoryName}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <CustomStepper
        onHandleNext={handleSubmitCategories}
        isNextEnabled={isNextEnabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 0,
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  heading: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: '#666',
    marginBottom: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    flexBasis: '48%',
    backgroundColor: '#F3ECFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryCardSelected: {
    backgroundColor: '#D0BCFF',
    borderColor: '#7B61FF',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  categoryName: {
    textAlign: 'center',
  },
});

export default Step2;
