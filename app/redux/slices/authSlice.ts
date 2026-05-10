import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store/store';
import { UserResponseType, LoginResponse } from '../../types/api/apiResponses';
import { User } from '../../types/api/modelTypes';

type AuthState = {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  error: string | null;
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<LoginResponse>) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.error = null;
    },
    setAuthUserState(state, action: PayloadAction<UserResponseType>) {
      state.user = action.payload.data;
    },
    updateTokens(
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>,
    ) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.error = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});

export const {
  loginSuccess,
  setAuthUserState,
  loginFailure,
  logout,
  updateTokens,
} = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;
