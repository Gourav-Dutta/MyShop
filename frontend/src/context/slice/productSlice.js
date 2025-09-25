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
    // Get product by category
    getProductsByCategory: builder.query({
      query: () => `product/getAll`,
    }),
    // Get product veriety
    getProductVerityBtProductId: builder.query({
      query: (id) => `variety/product/${id}`,
    }),
    // Get product by sub category
    getProductBySubCategory: builder.query({
      query: (subCategory) => `product/sub_category/${subCategory}`,
    }),
    // Get all brands
    getAllBrands: builder.query({
      query: () => "brand/all",
    }),
    // getProductsBySearch: builder.query({
    //   query: (searchTerm) => `search?q=${searchTerm}`,
    // }),

    // Get product by product name or sub-ctaegory name  (Based on search input)
    getProductsBySearch: builder.query({
      query: ({ q, brand }) => {
        let url = `search?q=${encodeURIComponent(q)}`;
        if (brand) url += `&brand=${encodeURIComponent(brand)}`;
        return url;
      },
    }),
    // Get a particular user order list
    getUserOrder: builder.query({
      query: () => "order/userId",
      providesTags: ["getUserOrder"],
    }),
    // Add to cart function
    addToCart: builder.mutation({
      query: (task) => ({
        url: "/user/addToCart",
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["getAddToCard"],
    }),
    // Get a user cart product list
    getAddToCard: builder.query({
      query: () => "/user/addToCart/getProduct",
      providesTags: ["getAddToCard"],
    }),
    // Get a user profile
    getUserProfile: builder.query({
      query: () => "/user/one",
      providesTags: ["getUserProfile"],
    }),
    // Get address of a user using address-id (Since A User May Have Multiple address)
    getAddOnaddId: builder.query({
      query: (addId) => `add/addId/userId/${addId}`,
    }),
    // Remove from add-to-cart function
    removeFromAddToCart: builder.mutation({
      query: ({ productVarietyId }) => ({
        url: "/user/addToCart/delete",
        method: "DELETE",
        body: { productVarietyId }, // Because my backend require an object - productVarietyId : "1" , not simply "1"
      }),
      invalidatesTags: ["getAddToCard"],
    }),
    // Placing new Order function
    addOrder: builder.mutation({
      query: (orderData) => ({
        url: "/order/newOrder",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["getUserOrder"],
    }),
    // Update profile function
    updateProfile: builder.mutation({
      query: ({ name, email, phone_no }) => ({
        url: "/user/update",
        method: "PATCH",
        body: { name, email, phone_no },
      }),
      invalidatesTags: ["getUserProfile"],
    }),
    // Update address of a user based on address-Id function
    updateAddress: builder.mutation({
      query: ({ addId, house_no, pin_no, state, city }) => ({
        url: `/update/Address/${addId}`,
        method: "PATCH",
        body: { house_no, pin_no, state, city },
      }),
      invalidatesTags: ["getUserProfile"],
    }),
    // Update user address status function (Is_Primary)
    updateAddIs_Primary: builder.mutation({
      query: ({ addId, is_primary }) => ({
        url: "/update/Address/is_primary",
        method: "PUT",
        body: { addId, is_primary },
      }),
      invalidatesTags: ["getUserProfile"],
    }),
    // Add new address function
    addAddress: builder.mutation({
      query: ({ city, house_no, pin_no, state, is_primary }) => ({
        url: "/address/new",
        method: "POST",
        body: { city, house_no, pin_no, state, is_primary },
      }),
      invalidatesTags: ["getUserProfile"],
    }),
    // Get product that inserted of that seller using the product name or sub-category name
    getSellerProduct: builder.query({
      query: ({ q, brand }) => {
        let url = `search/seller?q=${encodeURIComponent(q)}`;
        if (brand) url += `&brand=${encodeURIComponent(brand)}`;
        return url;
      },
    }),
    // Get seller order details
    getSellerOrderDetails: builder.query({
      query: () => "orderItem/seller",
    }),
    // Get how many product a seller listed query
    getProductOfLoginSeller: builder.query({
      query: () => "seller/get",
    }),
    // Inserted new product in seller list
    addNewProduct: builder.mutation({
      query: ({
        name,
        description,
        sub_catagory_id,
        base_image,
        brand,
        status,
      }) => ({
        url: "/seller/entry",
        method: "POST",
        body: { name, description, sub_catagory_id, base_image, brand, status },
      }),
    }),
    // Get all sub-categories
    getAllSubCategories: builder.query({
      query: () => "sub_category/All",
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
  useGetUserProfileQuery,
  useUpdateProfileMutation,
  useGetAddOnaddIdQuery,
  useUpdateAddressMutation,
  useUpdateAddIs_PrimaryMutation,
  useAddAddressMutation,
  useGetSellerProductQuery,
  useGetSellerOrderDetailsQuery,
  useGetProductOfLoginSellerQuery,
  useAddNewProductMutation,
  useGetAllSubCategoriesQuery,
} = productApi;
