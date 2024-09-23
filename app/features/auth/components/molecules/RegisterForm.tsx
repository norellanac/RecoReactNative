import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from '../../../../components/atoms';
import { useTranslation } from 'react-i18next';
import '../../../../helpers/i18n';
import '../../../../../polyfills';
import { Button } from '../../../../components/atoms';
import { useAppDispatch } from '@/app/hooks/useAppDispatch';
import { loginSuccess } from '@/app/redux/slices/authSlice';

export const RegisterForm: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const handleLogin = () => {
        const user = { id: '1', name: 'John Doe', email: 'john.doe@example.com' };
        dispatch(loginSuccess(user));
    };

    const handleSubmit = (values: { fullName: string; phoneNumber: string; password: string; confirmPassword: string }) => {
        console.log(values);
        handleLogin();
    };

    return (
        <Formik
            initialValues={{ fullName: '', phoneNumber: '', password: '', confirmPassword: '' }}
            onSubmit={handleSubmit}
            validationSchema={Yup.object().shape({
                fullName: Yup.string().required(t('Forms.required')),
                phoneNumber: Yup.string().required(t('Forms.required')),
                password: Yup.string()
                    .min(6, t('Forms.password_long'))
                    .required(t('Forms.required')),
                confirmPassword: Yup.string()
                    .min(6, t('Forms.password_long'))
                    .required(t('Forms.required')),
            })}
        >
            {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                <View style={styles.form}>
                    <TextInput
                        placeholder={t('Forms.full_name')}
                        onChangeText={handleChange('fullName')}
                        onBlur={() => handleBlur('fullName')}
                        value={values.fullName}
                        errorMsg={errors.fullName}
                        variant="underlined"
                        label={t('Forms.full_name')}
                    />

                    <TextInput
                        placeholder={t('Forms.phone_number')}
                        onChangeText={handleChange('phoneNumber')}
                        onBlur={() => handleBlur('phoneNumber')}
                        value={values.phoneNumber}
                        errorMsg={errors.phoneNumber}
                        variant="underlined"
                        label={t('Forms.phone_number')}
                    />


                    <TextInput
                        placeholder={t('Forms.password')}
                        onChangeText={handleChange('password')}
                        onBlur={() => handleBlur('password')}
                        value={values.password}
                        errorMsg={errors.password}
                        variant="underlined"
                        label={t('Forms.password')}
                        actionIcon="eye"
                        especialIcon="-sharp"
                    />

                    <TextInput
                        placeholder={t('Forms.confirm_password')} 
                        onChangeText={handleChange('confirmPassword')}
                        onBlur={() => handleBlur('confirmPassword')}
                        value={values.confirmPassword}
                        errorMsg={errors.confirmPassword}
                        variant="underlined"
                        label={t('Forms.confirm_password')} 
                        actionIcon="eye"
                        especialIcon="-sharp"
                    />
                    <Button variant="filled" title="Log In" onPress={handleSubmit} />
                </View>
            )}
        </Formik>
    );
};

const styles = StyleSheet.create({
    form: {
        marginTop: 30,
        padding: 16,
    },
});