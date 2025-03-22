import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithReauth from './baseQueryWithReauth';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => 'public/products/',
    }),
    getProductById: builder.query({
      query: (id) => `/products/${id}/`,
    }),
    createProduct: builder.mutation({
      query: (productData) => ({
        url: 'products/',
        method: 'POST',
        body: productData,
      }),
    }),
    updateProduct: builder.mutation({
      query: ({ productId, productData }) => ({
        url: `products/${productId}`,
        method: 'PUT',
        body: productData,
      }),
    }),
    uploadProductImage: builder.mutation({
      query: ({ productId, formData }) => ({
        url: `products/${productId}/image`,
        method: 'PUT',
        body: formData,
        formData: true,
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} = productApi;
