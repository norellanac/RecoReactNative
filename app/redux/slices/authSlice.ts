import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../redux/store/store';
import { LoginResponse, UserResponseType } from '@/app/types/api/apiResponses';

type AuthState = {
  isAuthenticated: boolean;
  token: string | null;
  user: UserResponseType | null;
  error: string | null;
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<LoginResponse>) {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      state.token = null;
    },
  },
});

export const { loginSuccess, loginFailure, logout } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export default authSlice.reducer;
