import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createApi } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/api/",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("ACCESS_TOKEN"); // or get from Redux
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    getProductsByCategory: builder.query({
      query: () => `product/getAll`,
    }),
    getProductVerityBtProductId: builder.query({
      query: (id) => `variety/product/${id}`,
    }),
    getProductBySubCategory: builder.query({
      query: (subCategory) => `product/sub_category/${subCategory}`,
    }),
    getAllBrands: builder.query({
      query: () => "brand/all",
    }),
    // getProductsBySearch: builder.query({
    //   query: (searchTerm) => `search?q=${searchTerm}`,
    // }),
    getProductsBySearch: builder.query({
      query: ({ q, brand }) => {
        let url = `search?q=${encodeURIComponent(q)}`;
        if (brand) url += `&brand=${encodeURIComponent(brand)}`;
        return url;
      },
    }),
    getUserOrder: builder.query({
      query: () => "order/userId",
      providesTags: ["getUserOrder"]
    }),
    addToCart: builder.mutation({
      query: (task) => ({
        url: "/user/addToCart",
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["getAddToCard"],
    }),
    getAddToCard: builder.query({
      query: () => "/user/addToCart/getProduct",
      providesTags: ["getAddToCard"],
    }),
    getUserProfile: builder.query({
      query : ()=> "/user/one"
    }),
    removeFromAddToCart: builder.mutation({
      query: ({ productVarietyId }) => ({
        url: "/user/addToCart/delete",
        method: "DELETE",
        body: { productVarietyId }, // Because my backend require an object - productVarietyId : "1" , not simply "1"
      }),
      invalidatesTags: ["getAddToCard"],
    }),
    addOrder: builder.mutation({
      query: (orderData) => ({
        url: "/order/newOrder",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["getUserOrder"]
    }),
  }),
});

export const {
  useGetProductsByCategoryQuery,
  useGetProductVerityBtProductIdQuery,
  useAddToCartMutation,
  useGetAddToCardQuery,
  useRemoveFromAddToCartMutation,
  useGetProductBySubCategoryQuery,
  useGetAllBrandsQuery,
  useGetProductsBySearchQuery,
  useLazyGetProductsBySearchQuery,
  useGetUserOrderQuery,
  useAddOrderMutation,
  useGetUserProfileQuery
} = productApi;
