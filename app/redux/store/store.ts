import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';
import authReducer from '../slices/authSlice';
import serviceStepperReducer from '../slices/serviceStepperSlice';
import { authApi } from '../../services/authApi';
import { productApi } from '../../services/productApi';
import { categoryApi } from '../../services/categoryApi';
import { userApi } from '../../services/userApi';
import { ordersApi } from '../../services/ordersApi';
import { locationsApi } from '../../services/locationsApi';
import { chatApi } from '../../services/chatApi';

const rootReducer = combineReducers({
  auth: authReducer,
  serviceStepper: serviceStepperReducer,
  [authApi.reducerPath]: authApi.reducer,
  [productApi.reducerPath]: productApi.reducer,
  [categoryApi.reducerPath]: categoryApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [ordersApi.reducerPath]: ordersApi.reducer,
  [locationsApi.reducerPath]: locationsApi.reducer,
  [chatApi.reducerPath]: chatApi.reducer,
  // Add other reducers here
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'serviceStepper'], // Only persist the auth and serviceStepper reducers
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      authApi.middleware,
      productApi.middleware,
      categoryApi.middleware,
      userApi.middleware,
      ordersApi.middleware,
      locationsApi.middleware,
      chatApi.middleware,
    ),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
