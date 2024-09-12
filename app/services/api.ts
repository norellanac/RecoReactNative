import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://your-api-url.com/' }),
  endpoints: (builder) => ({
    getExampleData: builder.query<any, void>({
      query: () => 'example-endpoint',
    }),
    // Add other endpoints here
  }),
});

export const { useGetExampleDataQuery } = api;