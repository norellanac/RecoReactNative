import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../redux/store/store';
import { selectAuth, logout } from '../redux/slices/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.EXPO_PUBLIC_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const authState = selectAuth(getState() as RootState);
    const token = authState.token;
    if (token) headers.set('Authorization', `${token}`);
    return headers;
  },
});

const baseQueryWithReauth: typeof baseQuery = async (
  args,
  api,
  extraOptions,
) => {
  const result = await baseQuery(args, api, extraOptions);

  const errorStatus =
    result.error?.status === 401 || result.error?.status === 403;
  const errorOriginalStatus =
    result.error?.originalStatus === 401 || result.error?.originalStatus === 403;
  if (errorStatus || errorOriginalStatus) api.dispatch(logout());

  return result;
};

export default baseQueryWithReauth;