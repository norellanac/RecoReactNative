import React from 'react';
import { Screen } from '../../../components/templates';
import { ProfileStackParams } from './ProfileStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from './../../../components/atoms';
import LanguageSwitcher from '@/app/components/molecules/LanguageSwitcher';
import { useAppDispatch } from '@/app/hooks/useAppDispatch';
import { logout } from '@/app/redux/slices/authSlice';
type Props = NativeStackScreenProps<ProfileStackParams, 'Profile'>;

export const LandingProfile = ({ navigation } /** route */ : Props) => {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Screen>
      <LanguageSwitcher />
      <Button
        variant="elevated"
        title="Landing Profile"
        onPress={() => navigation.navigate('Profile')}
      />
      <Button
        variant="text"
        title="Example Screen Profile"
        onPress={() => navigation.navigate('ExampleProfile')}
      />
      <Button variant="filled" title="Logout" onPress={handleLogout} />
    </Screen>
  );
};
