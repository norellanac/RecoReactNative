import React from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, TextInput } from '@/app/components/atoms';
import { useTranslation } from 'react-i18next';
import { Formik, FieldArray } from 'formik';
import * as Yup from 'yup';
import { useUpdateProductMutation } from '@/app/services/productApi';
import { useAppDispatch } from '@/app/hooks/useAppDispatch';
import { useAppSelector } from '@/app/hooks/useAppSelector';
import {
  selectStepper,
  setServiceState,
} from '@/app/redux/slices/serviceStepperSlice';
import CustomStepper from './CustomStepper';

const Step4 = ({ onNext }: { onNext?: () => void }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const stepperState = useAppSelector(selectStepper);
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const validationSchema = Yup.object().shape({
    skills: Yup.array().of(
      Yup.object().shape({
        tagsTextField: Yup.string().required(
          t('forms.commons.required', 'Required'),
        ),
        titleTextField: Yup.string().required(
          t('forms.commons.required', 'Required'),
        ),
        descriptionTextField: Yup.string(),
      }),
    ),
  });

  const handleUpdate = async (values, { setSubmitting }) => {
    try {
      const payload = {
        type: 1,
        price: 0,
        id: stepperState.service?.id,
        details: values.skills.map((skill) => ({
          label: skill.tagsTextField,
          value: skill.titleTextField,
          description: skill.descriptionTextField,
        })),
      };

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
      initialValues={{
        skills: [
          { tagsTextField: '', titleTextField: '', descriptionTextField: '' },
        ],
      }}
      validationSchema={validationSchema}
      onSubmit={handleUpdate}
    >
      {({
        values,
        errors,
        touched,
        setFieldValue,
        isSubmitting,
        isValid,
        handleSubmit,
      }) => (
        <View style={{ flex: 1 }}>
          <ScrollView
            style={styles.container}
            keyboardShouldPersistTaps="handled"
          >
            <Text
              variant="title"
              size="medium"
              color="info"
              style={styles.heading}
            >
              {t('businessStepper.step4.step4', 'Step 4')}
            </Text>
            <Text
              variant="headline"
              size="small"
              color="info"
              style={styles.title}
            >
              {t(
                'businessStepper.step4.title',
                'Do you offer other services? 🌟',
              )}
            </Text>
            <Text
              variant="title"
              size="small"
              color="secondary"
              style={styles.description}
            >
              {t(
                'businessStepper.step4.description',
                'Include all your skills: the more you add, the more clients will find you!',
              )}
            </Text>

            <FieldArray name="skills">
              {({ push, remove }) => (
                <View>
                  {values.skills.map((_, index) => (
                    <View key={index} style={styles.skillCard}>
                      <Text
                        variant="label"
                        size="large"
                        color="primary"
                        style={styles.label}
                      >
                        {t('businessStepper.step4.tagsInput', 'Skill Tag')}
                      </Text>
                      <TextInput
                        variant="outlined"
                        outlineColor="#E0E0E0"
                        style={styles.input}
                        placeholder={t(
                          'businessStepper.step4.tagsTextField',
                          'e.g. Electrician',
                        )}
                        value={values.skills[index].tagsTextField}
                        onChangeText={(text) =>
                          setFieldValue(`skills.${index}.tagsTextField`, text)
                        }
                      />
                      {touched.skills?.[index]?.tagsTextField &&
                        errors.skills?.[index]?.tagsTextField && (
                          <Text style={styles.error}>
                            {errors.skills[index].tagsTextField}
                          </Text>
                        )}

                      <Text
                        variant="label"
                        size="large"
                        color="primary"
                        style={styles.label}
                      >
                        {t('businessStepper.step4.titleInput', 'Skill Title')}
                      </Text>
                      <TextInput
                        variant="outlined"
                        outlineColor="#E0E0E0"
                        style={styles.input}
                        placeholder={t(
                          'businessStepper.step4.titleTextField',
                          'e.g. Home wiring',
                        )}
                        value={values.skills[index].titleTextField}
                        onChangeText={(text) =>
                          setFieldValue(`skills.${index}.titleTextField`, text)
                        }
                      />
                      {touched.skills?.[index]?.titleTextField &&
                        errors.skills?.[index]?.titleTextField && (
                          <Text style={styles.error}>
                            {errors.skills[index].titleTextField}
                          </Text>
                        )}

                      <Text
                        variant="label"
                        size="large"
                        color="primary"
                        style={styles.label}
                      >
                        {t(
                          'businessStepper.step4.descriptionInput',
                          'Description',
                        )}
                      </Text>
                      <TextInput
                        variant="outlined"
                        outlineColor="#E0E0E0"
                        style={[styles.input, { height: 80 }]}
                        placeholder={t(
                          'businessStepper.step4.descriptionTextField',
                          'Describe your skill',
                        )}
                        value={values.skills[index].descriptionTextField}
                        onChangeText={(text) =>
                          setFieldValue(
                            `skills.${index}.descriptionTextField`,
                            text,
                          )
                        }
                        multiline
                      />

                      {values.skills.length > 1 && (
                        <TouchableOpacity
                          style={styles.removeBtn}
                          onPress={() => remove(index)}
                        >
                          <Text
                            variant="label"
                            size="large"
                            color="error"
                            style={styles.removeBtnText}
                          >
                            {t(
                              'businessStepper.step4.deleteSkill',
                              'Delete skill',
                            )}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}

                  <Button
                    variant="outlined"
                    title={t(
                      'businessStepper.step4.addSkill',
                      'Add another skill',
                    )}
                    style={styles.addBtn}
                    onPress={() =>
                      push({
                        tagsTextField: '',
                        titleTextField: '',
                        descriptionTextField: '',
                      })
                    }
                  ></Button>
                </View>
              )}
            </FieldArray>
          </ScrollView>
          <CustomStepper
            onHandleNext={handleSubmit as any}
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
    marginBottom: 8,
  },
  heading: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    marginBottom: 16,
  },
  skillCard: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#FAF8FF',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  error: {
    color: '#F76B6A',
    marginBottom: 8,
  },
  removeBtn: {
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  removeBtnText: {
    fontWeight: 'bold',
  },
  addBtn: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    alignItems: 'center',
    marginTop: 8,
    paddingBottom: 10,
    marginBottom: 40,
  },
});

export default Step4;
