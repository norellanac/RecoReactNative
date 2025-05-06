import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithReauth from './baseQueryWithReauth';
import { ApiResponseType } from '../types/api/apiResponses';

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getOrders: builder.query<ApiResponseType<[]>, void>({
      query: () => 'orders/',
    }),
    createOrder: builder.mutation({
        query: (body) => ({
          url: 'orders/',
          method: 'POST',
          body,
        }),
      }),
  }),
});

export const {
    useGetOrdersQuery,
    useCreateOrderMutation,
} = ordersApi;