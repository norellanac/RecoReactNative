import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Text, TextInput } from '@/app/components/atoms';
import { useTranslation } from 'react-i18next';
import { Formik, FieldArray } from 'formik';
import * as Yup from 'yup';
import {
  useGetStatesQuery,
  useGetAllCitiesQuery,
} from '@/app/services/locationsApi';
import { useUpdateProductMutation } from '@/app/services/productApi';
import { useAppDispatch } from '@/app/hooks/useAppDispatch';
import { useAppSelector } from '@/app/hooks/useAppSelector';
import {
  selectStepper,
  setServiceState,
} from '@/app/redux/slices/serviceStepperSlice';

const Step3 = ({ onNext }: { onNext?: () => void }) => {
  const { t } = useTranslation();
  const { data: states } = useGetStatesQuery();
  const { data: cities } = useGetAllCitiesQuery();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const dispatch = useAppDispatch();
  const { service } = useAppSelector(selectStepper);

  const departments = states?.data || [];
  const allCities = cities?.data || [];

  const getCitiesByDepartment = (departmentId: number) =>
    allCities.filter((city) => city.stateId === departmentId);

  const validationSchema = Yup.object().shape({
    mainAddress: Yup.string().required(t('forms.commons.required', 'Required')),
    department: Yup.number().required(t('forms.commons.required', 'Required')),
    city: Yup.number().required(t('forms.commons.required', 'Required')),
    coverageAreas: Yup.array().of(
      Yup.object().shape({
        department: Yup.number(),
        city: Yup.number(),
      }),
    ),
  });

  const initialValues = {
    mainAddress: '',
    department: '' as number | '',
    city: '' as number | '',
    cityId: null as number | null,
    coverageAreas: [
      {
        department: '' as number | '',
        city: '' as number | '',
        cityId: null as number | null,
      },
    ],
  };

  const handleUpdate = async (values, { setSubmitting }) => {
    try {
      const payload = {
        type: 1,
        price: 0,
        locations: [
          {
            name: 'Main address',
            description: values.mainAddress,
            type: 1,
            cityId: values.city,
            latitude: 0,
            longitude: 0,
          },
          ...values.coverageAreas
            .filter((area) => area.department && area.city)
            .map((area) => ({
              name: 'Service zones',
              description: null,
              type: 2,
              cityId: area.city,
              latitude: 0,
              longitude: 0,
            })),
        ],
      };

      const response = await updateProduct({
        productId: service.id,
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

  if (!departments.length || !allCities.length) {
    return <ActivityIndicator style={{ marginTop: 40 }} />;
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleUpdate}
    >
      {({
        values,
        errors,
        touched,
        isValid,
        handleSubmit,
        setFieldValue,
        isSubmitting,
      }) => (
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
            {t('businessStepper.step3.step3', 'Step 3')}
          </Text>
          <Text
            variant="headline"
            size="small"
            color="info"
            style={styles.title}
          >
            {t('businessStepper.step3.title', 'Location')}
          </Text>
          <Text
            variant="title"
            size="medium"
            color="info"
            style={styles.heading}
          >
            {t(
              'businessStepper.step3.heading',
              'Where do you offer your service?',
            )}
          </Text>
          <Text
            variant="title"
            size="small"
            color="secondary"
            style={styles.description}
          >
            {t(
              'businessStepper.step3.description',
              'Add your main address and coverage areas',
            )}
          </Text>

          {/* Dirección principal */}
          <Text
            variant="label"
            size="medium"
            color="secondary"
            style={styles.label}
          >
            {t('businessStepper.step3.mainDirectionTitle', 'Main Address')}
          </Text>
          <TextInput
            variant="outlined"
            outlineColor="#E0E0E0"
            style={styles.input}
            placeholder={t(
              'businessStepper.step3.textField',
              'Where are you located?',
            )}
            value={values.mainAddress}
            onChangeText={(text) => setFieldValue('mainAddress', text)}
          />
          {touched.mainAddress && errors.mainAddress && (
            <Text style={styles.error}>{errors.mainAddress}</Text>
          )}

          {/* Departamento */}
          <Text
            variant="label"
            size="medium"
            color="secondary"
            style={styles.label}
          >
            {t('businessStepper.step3.inputDeparment', 'Department')}
          </Text>
          <ScrollView horizontal style={{ marginBottom: 8 }}>
            {departments.map((dept) => (
              <TouchableOpacity
                key={dept.id}
                style={[
                  styles.chip,
                  values.department === dept.id && styles.chipSelected,
                ]}
                onPress={() => {
                  setFieldValue('department', dept.id);
                  setFieldValue('city', '');
                }}
              >
                <Text
                  style={
                    values.department === dept.id
                      ? styles.chipTextSelected
                      : styles.chipText
                  }
                >
                  {dept.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {touched.department && errors.department && (
            <Text style={styles.error}>{errors.department}</Text>
          )}

          {/* Ciudad */}
          <Text style={styles.label}>
            {t('businessStepper.step3.inputCity', 'City')}
          </Text>
          <ScrollView horizontal style={{ marginBottom: 8 }}>
            {getCitiesByDepartment(values.department).map((city) => (
              <TouchableOpacity
                key={city.id}
                style={[
                  styles.chip,
                  values.city === city.id && styles.chipSelected,
                ]}
                onPress={() => setFieldValue('city', city.id)}
              >
                <Text
                  style={
                    values.city === city.id
                      ? styles.chipTextSelected
                      : styles.chipText
                  }
                >
                  {city.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {touched.city && errors.city && (
            <Text style={styles.error}>{errors.city}</Text>
          )}

          {/* Áreas de cobertura */}
          <Text style={styles.label}>
            {t('businessStepper.step3.secondDirectionTitle', 'Coverage Areas')}
          </Text>
          <FieldArray
            name="coverageAreas"
            render={(arrayHelpers) => (
              <View>
                {values.coverageAreas.map((area, index) => (
                  <View key={index} style={styles.coverageAreaContainer}>
                    {/* Departamento cobertura */}
                    <Text style={styles.label}>
                      {t('businessStepper.step3.inputDeparment', 'Department')}
                    </Text>
                    <ScrollView horizontal style={{ marginBottom: 8 }}>
                      {departments.map((dept) => (
                        <TouchableOpacity
                          key={dept.id}
                          style={[
                            styles.chip,
                            area.department === dept.id && styles.chipSelected,
                          ]}
                          onPress={() => {
                            setFieldValue(
                              `coverageAreas.${index}.department`,
                              dept.id,
                            );
                            setFieldValue(`coverageAreas.${index}.city`, '');
                          }}
                        >
                          <Text
                            style={
                              area.department === dept.id
                                ? styles.chipTextSelected
                                : styles.chipText
                            }
                          >
                            {dept.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                    {/* Ciudad cobertura */}
                    <Text style={styles.label}>
                      {t('businessStepper.step3.inputCity', 'City')}
                    </Text>
                    <ScrollView horizontal style={{ marginBottom: 8 }}>
                      {getCitiesByDepartment(area.department).map((city) => (
                        <TouchableOpacity
                          key={city.id}
                          style={[
                            styles.chip,
                            area.city === city.id && styles.chipSelected,
                          ]}
                          onPress={() =>
                            setFieldValue(
                              `coverageAreas.${index}.city`,
                              city.id,
                            )
                          }
                        >
                          <Text
                            style={
                              area.city === city.id
                                ? styles.chipTextSelected
                                : styles.chipText
                            }
                          >
                            {city.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                    {/* Botón eliminar */}
                    {index > 0 && (
                      <TouchableOpacity
                        style={styles.removeBtn}
                        onPress={() => arrayHelpers.remove(index)}
                      >
                        <Text style={styles.removeBtnText}>
                          {t('forms.commons.remove', 'Remove')}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
                {/* Botón agregar */}
                <TouchableOpacity
                  style={styles.addBtn}
                  onPress={() =>
                    arrayHelpers.push({
                      department: '',
                      city: '',
                      cityId: null,
                    })
                  }
                >
                  <Text style={styles.addBtnText}>
                    {t('forms.commons.addAnother', 'Add another')}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />

          {/* Botón siguiente */}
          <TouchableOpacity
            style={[
              styles.nextButton,
              !(
                values.mainAddress &&
                values.department &&
                values.city &&
                !isUpdating
              ) && styles.nextButtonDisabled,
            ]}
            onPress={handleSubmit as any}
            disabled={
              !(
                values.mainAddress &&
                values.department &&
                values.city &&
                !isUpdating
              )
            }
          >
            {isUpdating || isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.nextButtonText}>
                {t('common.next', 'Next')}
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
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
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    color: '#666',
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  error: { color: 'red', marginBottom: 8 },
  chip: {
    backgroundColor: '#F3ECFF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 4,
  },
  chipSelected: {
    backgroundColor: '#7B61FF',
  },
  chipText: {
    color: '#7B61FF',
    fontWeight: 'bold',
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  coverageAreaContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#FAF8FF',
  },
  removeBtn: {
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  removeBtnText: {
    color: '#F76B6A',
    fontWeight: 'bold',
  },
  addBtn: {
    backgroundColor: '#EADDFF',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  addBtnText: {
    color: '#7B61FF',
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#7B61FF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  nextButtonDisabled: {
    backgroundColor: '#ccc',
  },
  nextButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default Step3;
