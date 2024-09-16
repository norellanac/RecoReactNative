import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Screen } from '../../../components/templates';
import { HomeStackParams } from './HomeStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from './../../../components/atoms/Button';
import { TextInput } from './../../../components/atoms/TextInput';
import { useAppDispatch } from '@/app/hooks/useAppDispatch';
import { useAppSelector } from '@/app/hooks/useAppSelector';
import { logout, selectAuth } from '@/app/redux/slices/authSlice';
import { useGetExampleDataQuery } from '@/app/services/api';
type Props = NativeStackScreenProps<HomeStackParams, 'Home'>;

export const LandingHome = ({ navigation } /** route */ : Props) => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector(selectAuth);
  const { data } = useGetExampleDataQuery();

  const handleLogout = () => {
    dispatch(logout());
  };

  const userData = (
    <View style={styles.container}>
      <Text style={styles.label}>User ID:</Text>
      <Text style={styles.value}>{authState.user.id}</Text>
      <Text style={styles.label}>Name:</Text>
      <Text style={styles.value}>{authState.user.name}</Text>
      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>{authState.user.email}</Text>
    </View>
  );
  return (
    <Screen>
      <View
        style={{
          margin: 50,
          alignSelf: 'stretch',
          flex: 1,
          alignContent: 'center',
          marginVertical: 90,
        }}
      >
        <Button
          variant="elevated"
          title="Landing Home"
          onPress={() => navigation.navigate('Home')}
        />
        <Button
          variant="filled"
          title="Display user data from API"
          onPress={() => Alert.alert('User Data', JSON.stringify(data))}
        />
        {userData}
        <Button variant="filled" title="Logout" onPress={handleLogout} />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontWeight: 'bold',
  },
  value: {
    marginBottom: 10,
  },
  message: {
    fontStyle: 'italic',
  },
});
