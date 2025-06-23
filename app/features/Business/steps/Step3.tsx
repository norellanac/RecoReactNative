import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Text, TextInput, Button } from '@/app/components/atoms';
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
import { Dropdown } from 'react-native-element-dropdown';
import { Icon } from '@/app/components/atoms/Icon';
import CustomStepper from './CustomStepper';

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
      {({ values, errors, touched, handleSubmit, setFieldValue }) => (
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
              {t('businessStepper.step3.step3', 'Step 3')}
            </Text>
            <Text
              variant="headline"
              size="small"
              color="info"
              style={styles.title}
            >
              {t(
                'businessStepper.step3.title',
                'Where do you offer your service?',
              )}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 24,
              }}
            >
              <Icon
                name="map-marker"
                family="MaterialCommunityIcons"
                size={20}
                color="#7B61FF"
              />
              <Text variant="title" size="small" color="secondary">
                {t(
                  'businessStepper.step3.description',
                  'Add your main address and coverage areas',
                )}
              </Text>
            </View>

            {/* Dirección principal */}
            <Text
              variant="title"
              size="small"
              color="primary"
              style={styles.label}
            >
              {t('businessStepper.step3.mainDirectionTitle', 'Main Address')}
            </Text>
            <View style={styles.mainAddressContainer}>
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
                size="large"
                color="secondary"
                style={styles.label}
              >
                {t('businessStepper.step3.inputDeparment', 'Department')}
              </Text>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={departments}
                search
                maxHeight={300}
                labelField="name"
                valueField="id"
                placeholder={t(
                  'businessStepper.step3.selectState',
                  'Select state',
                )}
                searchPlaceholder={t(
                  'businessStepper.step3.searchState',
                  'Search state...',
                )}
                onChange={(dept) => {
                  setFieldValue('department', dept.id);
                  setFieldValue('city', '');
                }}
                renderLeftIcon={() => (
                  <Icon name="location-outline" family="Ionicons" size={18} />
                )}
              />
              {touched.department && errors.department && (
                <Text style={styles.error}>{errors.department}</Text>
              )}

              {/* Ciudad */}
              <Text
                variant="label"
                size="large"
                color="secondary"
                style={styles.label}
              >
                {t('businessStepper.step3.inputCity', 'City')}
              </Text>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={getCitiesByDepartment(values.department)}
                search
                maxHeight={300}
                labelField="name"
                valueField="id"
                placeholder={t(
                  'businessStepper.step3.selectCity',
                  'Select city',
                )}
                searchPlaceholder={t(
                  'businessStepper.step3.searchCity',
                  'Search city...',
                )}
                onChange={(city) => setFieldValue('city', city.id)}
                value={values.city}
                renderLeftIcon={() => (
                  <Icon name="location-outline" family="Ionicons" size={18} />
                )}
              />
              {touched.city && errors.city && (
                <Text style={styles.error}>{errors.city}</Text>
              )}
            </View>
            {/* Áreas de cobertura */}
            <Text
              variant="title"
              size="small"
              color="primary"
              style={styles.label}
            >
              {t(
                'businessStepper.step3.secondDirectionTitle',
                'Coverage Areas',
              )}
            </Text>
            <FieldArray
              name="coverageAreas"
              render={(arrayHelpers) => (
                <View>
                  {values.coverageAreas.map((area, index) => (
                    <View key={index} style={styles.coverageAreaContainer}>
                      {/* Departamento cobertura */}
                      <Text
                        variant="label"
                        size="large"
                        color="secondary"
                        style={styles.label}
                      >
                        {t(
                          'businessStepper.step3.inputDeparment',
                          'Department',
                        )}
                      </Text>
                      <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={departments}
                        value={area.department}
                        search
                        maxHeight={300}
                        labelField="name"
                        valueField="id"
                        placeholder={t(
                          'businessStepper.step3.selectState',
                          'Select state',
                        )}
                        searchPlaceholder={t(
                          'businessStepper.step3.searchState',
                          'Search state...',
                        )}
                        onChange={(dept) => {
                          setFieldValue(
                            `coverageAreas[${index}].department`,
                            dept.id,
                          );
                          setFieldValue(`coverageAreas[${index}].city`, '');
                        }}
                        renderLeftIcon={() => (
                          <Icon
                            name="location-outline"
                            family="Ionicons"
                            size={20}
                          />
                        )}
                      />
                      {/* Ciudad cobertura */}
                      <Text
                        variant="label"
                        size="large"
                        color="secondary"
                        style={styles.label}
                      >
                        {t('businessStepper.step3.inputCity', 'City')}
                      </Text>
                      <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={getCitiesByDepartment(area.department)}
                        value={area.city}
                        search
                        maxHeight={300}
                        labelField="name"
                        valueField="id"
                        placeholder={t(
                          'businessStepper.step3.selectCity',
                          'Select city',
                        )}
                        searchPlaceholder={t(
                          'businessStepper.step3.searchCity',
                          'Search city...',
                        )}
                        onChange={(city) =>
                          setFieldValue(`coverageAreas[${index}].city`, city.id)
                        }
                        renderLeftIcon={() => (
                          <Icon
                            name="location-outline"
                            family="Ionicons"
                            size={20}
                          />
                        )}
                      />

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
                  <Button
                    variant="outlined"
                    title={t('forms.commons.addAnother', '+  Add another')}
                    disabled={isUpdating}
                    style={styles.addBtn}
                    onPress={() =>
                      arrayHelpers.push({
                        department: '',
                        city: '',
                        cityId: null,
                      })
                    }
                  ></Button>
                </View>
              )}
            />
          </ScrollView>
          <CustomStepper
            onHandleNext={handleSubmit}
            isNextEnabled={
              !!values.mainAddress &&
              !!values.department &&
              !!values.city &&
              !isUpdating
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
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    marginLeft: 2,
    marginBottom: 12,
  },
  heading: {
    fontWeight: '600',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  mainAddressContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    backgroundColor: '#FAF8FF',
  },
  input: {
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  error: { color: 'red', marginBottom: 8 },
  dropdown: {
    height: 50,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  placeholderStyle: {
    marginLeft: 8,
    color: '#999',
  },
  selectedTextStyle: {
    marginLeft: 8,
    color: '#333',
  },
  inputSearchStyle: {
    marginLeft: 8,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  iconStyle: {
    width: 20,
    height: 20,
    tintColor: '#7B61FF',
  },

  coverageAreaContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#FCFCFC',
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
    borderColor: '#ccc',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 32,
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
