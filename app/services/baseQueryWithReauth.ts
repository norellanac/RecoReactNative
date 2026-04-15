import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../redux/store/store';
import { selectAuth, logout } from '../redux/slices/authSlice';
import { BASE_URL } from '../utils/Environment';
import { logger } from '../utils/logging/Logger';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
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
  const meta = typeof args === 'string' ? { url: args } : args;
  const requestId = Math.random().toString(36).substring(7);
  const method = (meta.method || 'GET').toUpperCase();

  logger.http('==REQUEST==', `${method} » ${meta.url}`, {
    requestId,
    headers: meta.headers,
    body: meta.body,
    params: meta.params,
  });

  const startTime = Date.now();
  const result = await baseQuery(args, api, extraOptions);
  const duration = Date.now() - startTime;

  if (result.error) {
    const errorData = (result.error as any).data || (result.error as any).error;
    logger.error('==ERROR==', `${method} « ${meta.url} (${duration}ms)`, {
      requestId,
      status: result.error.status,
      error: errorData,
    });
  } else {
    const status = result.meta?.response?.status;
    logger.http(
      '==RESPONSE==',
      `${method} « ${meta.url} (${status}) [${duration}ms]`,
      {
        requestId,
        status,
        data: result.data, // Now logging response data for better debugging
      },
    );
  }

  const errorStatus =
    result.error?.status === 401 || result.error?.status === 403;
  const errorOriginalStatus =
    (result.error as any)?.originalStatus === 401 ||
    (result.error as any)?.originalStatus === 403;
  if (errorStatus || errorOriginalStatus) api.dispatch(logout());

  return result;
};

export default baseQueryWithReauth;
