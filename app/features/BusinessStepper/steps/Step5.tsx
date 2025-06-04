import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, TextInput } from '@/app/components/atoms';
import dollarImage from '@/app/assets/img/stepper/step5_dollarImage.png';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useUpdateProductMutation } from '@/app/services/productApi';
import { useAppDispatch } from '@/app/hooks/useAppDispatch';
import { useAppSelector } from '@/app/hooks/useAppSelector';
import {
  selectStepper,
  setServiceState,
} from '@/app/redux/slices/serviceStepperSlice';
import CustomStepper from './CustomStepper';

const Step5 = ({ onNext }: { onNext?: () => void }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const stepperState = useAppSelector(selectStepper);
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const validationSchema = Yup.object().shape({
    price: Yup.number()
      .typeError(t('forms.commons.mustBeNumber', 'Must be a number'))
      .required(t('forms.commons.required', 'Required')),
  });

  const handleUpdate = async (values, { setSubmitting }) => {
    try {
      const payload = { price: values.price };
      const response = await updateProduct({
        productId: stepperState.service.id,
        productData: payload,
      }).unwrap();
      dispatch(setServiceState(response.productService));
      if (onNext) onNext();
    } catch (err) {
      // Manejo de errores si es necesario
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ price: undefined }}
      validationSchema={validationSchema}
      onSubmit={handleUpdate}
    >
      {({
        errors,
        touched,
        isSubmitting,
        isValid,
        handleSubmit,
        values,
        setFieldValue,
      }) => (
        <View style={{ flex: 1 }}>
          <ScrollView style={styles.container}>
            <Text
              variant="title"
              size="medium"
              color="info"
              style={styles.heading}
            >
              {t('businessStepper.step5.step5', 'Step 5')}
            </Text>
            <Text
              variant="headline"
              size="small"
              color="info"
              style={styles.title}
            >
              {t(
                'businessStepper.step5.title',
                'How much do you charge per day? 💰',
              )}
            </Text>
            <Text
              variant="title"
              size="small"
              color="secondary"
              style={styles.description}
            >
              {t(
                'businessStepper.step5.description',
                "Indicate your approximate daily rate. Don't worry, you can adjust it later based on each job",
              )}
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                variant="rounded"
                outlineColor="#E0E0E0"
                style={styles.input}
                placeholder={t(
                  'businessStepper.step5.priceTextField',
                  'Price Eg. 350',
                )}
                keyboardType="numeric"
                value={values.price?.toString() || ''}
                onChangeText={(text) =>
                  setFieldValue('price', text.replace(/[^0-9.]/g, ''))
                }
              />
              {touched.price && errors.price && (
                <Text
                  variant="label"
                  size="large"
                  color="error"
                  style={styles.error}
                >
                  {errors.price}
                </Text>
              )}
              <Text
                variant="body"
                size="medium"
                color="primary"
                style={styles.note}
              >
                {t(
                  'businessStepper.step5.note',
                  'Note: You can update your price at any time.',
                )}
              </Text>
              <View style={styles.illustrationContainer}>
                <Image
                  source={dollarImage}
                  style={styles.illustration}
                  resizeMode="contain"
                  accessible
                  accessibilityLabel="Dollar illustration"
                />
              </View>
            </View>
          </ScrollView>
          <CustomStepper
            onHandleNext={handleSubmit}
            isNextEnabled={isValid && !isSubmitting && !isUpdating}
          />
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  heading: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    padding: 12,
  },
  error: {
    //  color: '#F76B6A',
    marginBottom: 8,
  },
  note: {
    fontSize: 13,
    marginTop: 4,
  },
  nextButton: {
    backgroundColor: '#7B61FF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  nextButtonDisabled: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  illustration: {
    width: 150,
    height: 150,
  },
});

export default Step5;
