import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store/store';
import { BrandingConfig } from '../../types/branding';

type BrandingState = {
  config: BrandingConfig | null;
  isLoaded: boolean;
};

const initialState: BrandingState = {
  config: null,
  isLoaded: false,
};

const brandingSlice = createSlice({
  name: 'branding',
  initialState,
  reducers: {
    setBranding(state, action: PayloadAction<BrandingConfig>) {
      state.config = action.payload;
      state.isLoaded = true;
    },
    clearBranding(state) {
      state.config = null;
      state.isLoaded = false;
    },
  },
});

export const { setBranding, clearBranding } = brandingSlice.actions;
export const selectBranding = (state: RootState) => state.branding;
export default brandingSlice.reducer;
