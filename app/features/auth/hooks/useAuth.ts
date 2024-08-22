import { useState, useEffect } from 'react';
//import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuth = () => {
  const [isAuth, setIsAuth] = useState<boolean>(false);

  useEffect(() => {
    checkIsAuth();
  }, []);

  //this hook should be used to check if the user is authenticated
  //saving the value in device storage using mmkv library
  const checkIsAuth = async () => {
    try {
      //   const value = await AsyncStorage.getItem('isAuth');
      //   if (value !== null) {
      //     setIsAuth(value === 'true');
      //   }
    } catch (error) {
      console.error('Error reading isAuth from AsyncStorage', error);
    }
  };

  const login = async () => {
    //await AsyncStorage.setItem('isAuth', 'true');
    setIsAuth(true);
  };

  const logout = async () => {
    //await AsyncStorage.setItem('isAuth', 'false');
    setIsAuth(false);
  };

  return { isAuth, login, logout, checkIsAuth };
};
