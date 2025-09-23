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
      providesTags: ["getUserOrder"],
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
      query: () => "/user/one",
      providesTags: ["getUserProfile"],
    }),
    getAddOnaddId : builder.query({
      query : (addId) => `add/addId/userId/${addId}`,
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
      invalidatesTags: ["getUserOrder"],
    }),
    updateProfile: builder.mutation({
      query: ({ name, email, phone_no }) => ({
        url: "/user/update",
        method: "PATCH",
        body: { name, email, phone_no },
      }),
      invalidatesTags: ["getUserProfile"],
    }),
    updateAddress : builder.mutation({
      query : ({addId, house_no, pin_no, state, city}) => ({
        url : `/update/Address/${addId}`,
        method: "PATCH",
        body: {house_no, pin_no, state, city}
      }),
      invalidatesTags : ['getUserProfile'],
    }),
    updateAddIs_Primary : builder.mutation({
      query: ({addId, is_primary}) => ({
        url: "/update/Address/is_primary",
        method: "PUT",
        body: {addId, is_primary}
      }),
       invalidatesTags : ['getUserProfile'],
    }),
    addAddress : builder.mutation({
      query : ({city, house_no, pin_no, state, is_primary}) => ({
        url : "/address/new",
        method : "POST",
        body : {city, house_no, pin_no, state, is_primary}
      }),
      invalidatesTags : ['getUserProfile'],
    })
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
  useGetUserProfileQuery,
  useUpdateProfileMutation,
  useGetAddOnaddIdQuery,
  useUpdateAddressMutation,
  useUpdateAddIs_PrimaryMutation,
  useAddAddressMutation
} = productApi;
