import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithReauth from './baseQueryWithReauth';
import { ApiResponseType } from '../types/api/apiResponses';
import { ProductService } from '../types/api/modelTypes';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getProducts: builder.query<ApiResponseType<{items: ProductService[]}>, void>({
      query: () => 'public/products?limit=50&offset=1',
    }),
    getProductById: builder.query({
      query: (id) => `public/products/${id}/`,
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
