import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithReauth from './baseQueryWithReauth';
import { ApiResponseType } from '../types/api/apiResponses';

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Orders'],
  endpoints: (builder) => ({
    getOrders: builder.query<ApiResponseType<[]>, void>({
      query: () => 'orders/',
      providesTags: ['Orders'],
    }),
    getOrderById: builder.query({
      query: (id: number | string) => `orders/${id}`,
    }),
    createOrder: builder.mutation({
      query: (body) => ({
        url: 'orders/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Orders'],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
} = ordersApi;
