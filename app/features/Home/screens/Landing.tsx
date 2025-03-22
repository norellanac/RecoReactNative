import React from 'react';
import { Text, Alert, ScrollView } from 'react-native';
import { Screen } from '../../../components/templates';
import { HomeStackParams } from './HomeStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from './../../../components/atoms/Button';
import { useAppDispatch } from '@/app/hooks/useAppDispatch';
import { useAppSelector } from '@/app/hooks/useAppSelector';
import { logout, selectAuth } from '@/app/redux/slices/authSlice';
import CategoryCard from '../components/molecules/CategoryCard';
import Carousel from '../components/molecules/CarouselCard';
import { useGetCategoriesQuery } from '@/app/services/categoryApi';
type Props = NativeStackScreenProps<HomeStackParams, 'Home'>;

export const LandingHome = ({ navigation } /** route */ : Props) => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector(selectAuth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const { data, isLoading, isError } = useGetCategoriesQuery();

  const categories = data?.data || [];

  return (
    <Screen statusBarProps={{}} container>
      <Carousel />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ height: 150, padding: 0, margin: 0 }}
      >
        {categories.map((category, index) => (
          <CategoryCard key={index} title={category.name} icon={undefined} />
        ))}
      </ScrollView>
      <ScrollView style={{ height: 400 }}>
        <Button
          variant="filled"
          title="Display user data from API"
          onPress={() => Alert.alert('User Data', JSON.stringify(data?.data))}
        />
        <Text>{JSON.stringify(authState)}</Text>
        <Button variant="filled" title="Logout" onPress={handleLogout} />
      </ScrollView>
    </Screen>
  );
};
