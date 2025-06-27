import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductService } from '@/app/types/api/modelTypes';

interface FavoritesState {
  favoriteServices: ProductService[];
}

const initialState: FavoritesState = {
  favoriteServices: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addToFavorites: (state, action: PayloadAction<ProductService>) => {
      const existingIndex = state.favoriteServices.findIndex(
        service => service.id === action.payload.id
      );
      if (existingIndex === -1) {
        state.favoriteServices.push(action.payload);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string | number>) => {
      state.favoriteServices = state.favoriteServices.filter(
        service => service.id !== action.payload
      );
    },
    toggleFavorite: (state, action: PayloadAction<ProductService>) => {
      const existingIndex = state.favoriteServices.findIndex(
        service => service.id === action.payload.id
      );
      if (existingIndex === -1) {
        state.favoriteServices.push(action.payload);
      } else {
        state.favoriteServices.splice(existingIndex, 1);
      }
    },
    setFavorites: (state, action: PayloadAction<ProductService[]>) => {
      state.favoriteServices = action.payload;
    },
  },
});

export const { addToFavorites, removeFromFavorites, toggleFavorite, setFavorites } = favoritesSlice.actions;

// Selectores
export const selectFavorites = (state: { favorites: FavoritesState }) => state.favorites.favoriteServices;
export const selectIsFavorite = (state: { favorites: FavoritesState }, serviceId: string | number) =>
  state.favorites.favoriteServices.some(service => service.id === serviceId);

export default favoritesSlice.reducer;
