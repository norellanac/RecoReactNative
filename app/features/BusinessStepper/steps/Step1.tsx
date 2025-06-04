import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { Text, TextInput } from '@/app/components/atoms';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { launchImageLibrary } from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker';
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from '@/app/services/productApi';
import CustomStepper from './CustomStepper';
import { setServiceState } from '@/app/redux/slices/serviceStepperSlice';
import { useAppDispatch } from '@/app/hooks/useAppDispatch';
import { useAppSelector } from '@/app/hooks/useAppSelector';
import { selectAuth } from '@/app/redux/slices/authSlice';

const Step1 = ({ onNext }: { onNext?: (values: any) => void }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const debugAuth = useAppSelector(selectAuth);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [uploadProductImage, { isLoading: isUploading }] =
    useUploadProductImageMutation();

  const validationSchema = Yup.object({
    businessName: Yup.string().required(
      t('forms.commons.required', 'Required'),
    ),
    businessDescription: Yup.string().required(
      t('forms.commons.required', 'Required'),
    ),
  });

  const handleImageChange = async () => {
    console.log('Avatar pressed');
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaType: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      selectionLimit: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPreviewUrl(result.assets[0].uri);
      setSelectedImage(result.assets[0]);
      setImageError(null);
    }
  };

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setImageError(null); // Limpia error previo
    if (!selectedImage) {
      setImageError(t('forms.commons.required', 'Required'));
      setSubmitting(false);
      return;
    }
    try {
      const payloadServiceObject = {
        name: values.businessName,
        description: values.businessDescription,
        type: 1,
        price: 0,
        userId: debugAuth?.user?.id,
      };

      const productResponse =
        await createProduct(payloadServiceObject).unwrap();

      dispatch(setServiceState(productResponse?.productService));

      if (!productResponse?.productService?.id) {
        throw new Error('El backend no devolvió un ID válido');
      }

      // Subir imagen si hay una seleccionada
      if (selectedImage) {
        const formData = new FormData();
        formData.append('file', {
          uri: selectedImage.uri,
          name: selectedImage.fileName || 'photo.jpg',
          type: selectedImage.type || 'image/jpeg',
        });

        await uploadProductImage({
          productId: productResponse.productService.id,
          formData,
        }).unwrap();
      }

      if (onNext) onNext(values);
    } catch (err: any) {
      Alert.alert(
        t('forms.commons.error', 'Error'),
        err?.data?.message || err?.message || 'Ocurrió un error',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ businessName: '', businessDescription: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        isValid,
        isSubmitting,
      }) => (
        <View style={{ flex: 1 }}>
          <ScrollView style={styles.container}>
            <Text
              variant="title"
              size="medium"
              color="info"
              style={styles.heading}
            >
              {t('businessStepper.step1.step1', 'Step 1')}
            </Text>
            <Text
              variant="headline"
              size="small"
              color="info"
              style={styles.title}
            >
              {t(
                'businessStepper.step1.heading',
                'Let’s start with the basics',
              )}
            </Text>

            <Text
              variant="title"
              size="small"
              color="secondary"
              style={styles.description}
            >
              {t(
                'businessStepper.step1.description',
                'Tell us about your business',
              )}
            </Text>

            <TextInput
              variant="outlined"
              outlineColor="#E0E0E0"
              style={styles.input}
              placeholder={t(
                'businessStepper.step1.businessNamePlaceholder',
                'Business name',
              )}
              value={values.businessName}
              onChangeText={handleChange('businessName')}
              onBlur={handleBlur('businessName')}
            />
            {touched.businessName && errors.businessName && (
              <Text
                variant="title"
                size="small"
                color="error"
                style={styles.error}
              >
                {errors.businessName}
              </Text>
            )}

            <TextInput
              style={[styles.input, { height: 100 }]}
              outlineColor="#E0E0E0"
              placeholder={t(
                'businessStepper.step1.businessDescriptionPlaceholder',
                'Business description',
              )}
              value={values.businessDescription}
              onChangeText={handleChange('businessDescription')}
              onBlur={handleBlur('businessDescription')}
              multiline
            />
            {touched.businessDescription && errors.businessDescription && (
              <Text
                variant="title"
                size="small"
                color="error"
                style={styles.error}
              >
                {errors.businessDescription}
              </Text>
            )}

            {(isCreating || isUploading || isSubmitting) && (
              <ActivityIndicator style={{ marginVertical: 16 }} />
            )}
            <View style={styles.avatarRow}>
              <TouchableOpacity onPress={handleImageChange}>
                <Image
                  source={
                    previewUrl
                      ? { uri: previewUrl }
                      : require('@/app/assets/img/default-Reco-image.png')
                  }
                  style={styles.avatar}
                />
                <View style={styles.editIcon}>
                  <Text style={{ color: '#6750A4', fontWeight: 'bold' }}>
                    ✎
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={styles.avatarTextContainer}>
                <Text
                  variant="body"
                  size="medium"
                  color="secondary"
                  style={styles.avatarText}
                >
                  {t(
                    'businessStepper.step1.imageDescription',
                    'Add a photo or logo of your business so your customers can recognize you.',
                  )}
                </Text>
                {imageError && (
                  <Text
                    variant="title"
                    size="small"
                    color="error"
                    style={styles.error}
                  >
                    {imageError}
                  </Text>
                )}
              </View>
            </View>
          </ScrollView>
          <CustomStepper
            onHandleNext={handleSubmit}
            isNextEnabled={
              isValid &&
              !isSubmitting &&
              !isCreating &&
              !isUploading &&
              !!selectedImage
            }
          />
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    marginTop: 8,
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
    marginBottom: 16,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarTextContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 50,
    backgroundColor: '#eee',
  },
  avatarText: {
    textAlign: 'left',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#EADDFF',
    borderRadius: 12,
    padding: 4,
  },
  input: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  error: {
    marginTop: -16,
    marginBottom: 16,
  },
  nextButton: {
    backgroundColor: '#7B61FF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  nextButtonDisabled: {
    backgroundColor: '#ccc',
  },
  nextButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default Step1;
