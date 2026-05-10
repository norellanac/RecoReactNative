import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../redux/store/store';
import { selectAuth, logout, updateTokens } from '../redux/slices/authSlice';
import { BASE_URL } from '../utils/Environment';
import { logger } from '../utils/logging/Logger';

// Variable to track the refresh promise
let refreshPromise: Promise<any> | null = null;

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const authState = selectAuth(getState() as RootState);
    const token = authState.accessToken;
    if (token) headers.set('Authorization', `Bearer ${token}`);
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
  let result = await baseQuery(args, api, extraOptions);
  const duration = Date.now() - startTime;

  if (result.error) {
    const errorData = (result.error as any).data || (result.error as any).error;

    // Check for 401 Unauthorized or 403 Forbidden to trigger refresh
    // Sometimes servers return PARSING_ERROR with "Unauthorized" string when they return a 401 as plain text
    const isUnauthorized =
      result.error.status === 401 ||
      result.error.status === 403 ||
      (result.error.status === 'PARSING_ERROR' &&
        typeof result.error.error === 'string' &&
        result.error.error.includes('Unauthorized')) ||
      (result.error.data &&
        (result.error.data as any).message === 'Token not found in database');

    // If it's a login request, don't try to refresh
    const isLoginRequest = meta.url.includes('login/');

    if (isUnauthorized && !isLoginRequest) {
      const authState = selectAuth(api.getState() as RootState);
      const refreshToken = authState.refreshToken;

      if (refreshToken) {
        if (!refreshPromise) {
          logger.http('==AUTH==', 'Token expired, attempting refresh...');

          refreshPromise = baseQuery(
            {
              url: 'refresh-token/',
              method: 'POST',
              body: { refreshToken },
            },
            api,
            extraOptions,
          );
        }

        const refreshResult = await refreshPromise;

        // Reset promise for future use after it completes
        if (refreshResult) {
          refreshPromise = null;
        }

        if (refreshResult?.data) {
          const responseData =
            (refreshResult.data as any).data || refreshResult.data;
          const { accessToken, refreshToken: newRefreshToken } = responseData;

          if (accessToken && newRefreshToken) {
            api.dispatch(
              updateTokens({ accessToken, refreshToken: newRefreshToken }),
            );

            result = await baseQuery(args, api, extraOptions);

            logger.http(
              '==AUTH==',
              'Token refreshed successfully. Retried request.',
            );
          } else {
            logger.error('==AUTH==', 'Refresh response missing tokens.');
            api.dispatch(logout());
          }
        } else {
          logger.error('==AUTH==', 'Refresh token request failed.');
          api.dispatch(logout());
        }
      } else {
        logger.error('==AUTH==', 'No refresh token available.');
        api.dispatch(logout());
      }
    }

    if (result.error) {
      logger.error('==ERROR==', `${method} « ${meta.url} (${duration}ms)`, {
        requestId,
        status: result.error.status,
        error: errorData,
        rawError: result.error, // Added more details for debugging
      });
    }
  }

  if (!result.error) {
    const status = result.meta?.response?.status;
    logger.http(
      '==RESPONSE==',
      `${method} « ${meta.url} (${status}) [${duration}ms]`,
      {
        requestId,
        status,
        data: result.data,
      },
    );
  }

  return result;
};

export default baseQueryWithReauth;
