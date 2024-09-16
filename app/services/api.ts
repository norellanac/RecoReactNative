import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://jsonplaceholder.typicode.com/',
  }),
  endpoints: (builder) => ({
    getExampleData: builder.query<any, void>({
      query: () => 'users/1',
    }),
    // Add other endpoints here
  }),
});

export const { useGetExampleDataQuery } = api;
