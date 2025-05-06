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
import { TextInput } from '@/app/components/atoms';
import { Icon } from '@/app/components/atoms/Icon';
type Props = NativeStackScreenProps<HomeStackParams, 'Home'>;

export const LandingHome = ({ navigation } /** route */ : Props) => {
  const [search, setSearch] = React.useState('');
  const dispatch = useAppDispatch();
  const authState = useAppSelector(selectAuth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const { data, isLoading, isError } = useGetCategoriesQuery();

  const categories = data?.data || [];

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleClearSearch = () => {
    setSearch('');
  };

  return (
    <Screen statusBarProps={{}} container>
      <TextInput
        variant="outlined"
        placeholder="Search services that you need"
        value={search}
        onChange={handleChangeSearch}
        endAdornment={<Icon name="close" onPress={handleClearSearch} />}
        startAdornment={<Icon name="search" />}
      />
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
          isLoading={isLoading}
          disabled={isLoading}
          onPress={() => Alert.alert('User Data', JSON.stringify(data?.data))}
        />
        <Text>{JSON.stringify(authState)}</Text>
        <Button variant="filled" title="Logout" onPress={handleLogout} />
      </ScrollView>
    </Screen>
  );
};
