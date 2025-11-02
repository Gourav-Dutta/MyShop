import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createApi } from "@reduxjs/toolkit/query/react";


const baseUrl =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_LOCAL_API
    : import.meta.env.VITE_PROD_API;


export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("ACCESS_TOKEN"); 
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    // Get All Product :
    getProductsByCategory: builder.query({
      query: () => `product/getAll`,
    }),
    // Get product veriety by Product Id
    getProductVerityBtProductId: builder.query({
      query: (id) => `variety/product/${id}`,
      providesTags: ['getProductVerietyBtProductId'],
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
      query: ({ addId, house_no, pin_no, state, city, shop_line }) => ({
        url: `/update/Address/${addId}`,
        method: "PATCH",
        body: { house_no, pin_no, state, city, shop_line },
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
      query: ({ city, house_no, pin_no, state, is_primary, shop_line }) => ({
        url: "/address/new",
        method: "POST",
        body: { city, house_no, pin_no, state, is_primary, shop_line },
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
      query: (formData) => ({
        url: "/seller/entry",
        method: "POST",
        body: formData,
      }),
    }),
    // Get all sub-categories
    getAllSubCategories: builder.query({
      query: () => "sub_category/All",
    }),
    // Insert new variety function 
    insertNewVariety: builder.mutation({
      query: ({productId, sku, name, price, color, weight, liter, stock, size}) => ({
        url: `variety/entry/${productId}`,
        method: "POST",
        body:{sku, name, price, color, weight, liter, stock, size}
      }),
      invalidatesTags: ["getProductVerietyBtProductId"],
    }),
    // insert product variety image 
    insertImage : builder.mutation({
      query : ({varietyId, formData}) => ({
         url: `image/upload/${varietyId}`,
         method: "POST",
         body: formData
      }),
      invalidatesTags: ['getProductVerietyBtProductId']
    }),
    // Get order of a Seller
    getOrderOfSeller : builder.query({
      query : () => "orderItem/seller",
      providesTags: ['getOrderOfSeller'],
    }),
    // update order status
    updateOrderStatus: builder.mutation({
      query : ({orderId, status}) => ({
        url: `order/status/${orderId}`,
        method: "PATCH",
        body: {status}
      }),
      invalidatesTags: ['getOrderOfSeller'],
    }),
    // Get specific variety details by varietyId
    getSpecificVarietyDetails: builder.query({
      query: (varietyId) => `variety/varietyId/${varietyId}`
    }),
    // Update Product Variety
    updateProductVariety: builder.mutation({
      query: ({varietyId, formData}) => ({
        url: `/variety/update/seller/${varietyId}`,
        method: "PATCH",
        body: formData
      }),
      invalidatesTags: [""]
    }),
    // Get product By product Id
    getProductDetailsByProductId: builder.query({
      query: (productId) => `product/${productId}`
    }),
    // Update product by Product ID
    updateProduct: builder.mutation({
      query : ({productId, formData}) => ({
        url: `product/update/${productId}`,
        method: "PATCH",
        body: formData
      })
    }),
    // Delete product by product ID
    deleteProduct: builder.mutation({
      query : ({productId})=> ({
        url: `product/delete/${productId}`,
        method: "DELETE"
      })
    }),
    // Delete product variety by Variety-ID
    deleteVariety: builder.mutation({
      query: ({varietyId}) => ({
        url: `/variety/delete/${varietyId}`,
        method: "DELETE"
      }) 
    }),
    // Delete order by Order-Id
    deleteOrder: builder.mutation({
      query: ({orderId}) => 
      ({
        url: `order/orderId/${orderId}`,
        method: "DELETE"
      }),
      invalidatesTags: ["getUserOrder"]
    }),
    // Get all user -- Only for Admin
    getAllUser: builder.query({
      query: () => "/user/all"
    }),
    // Get all order -- Only for Admin
    getAllOrder: builder.query({
      query: () => "/order/getAll"
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
  useInsertNewVarietyMutation,
  useInsertImageMutation,
  useGetOrderOfSellerQuery,
  useUpdateOrderStatusMutation,
  useGetSpecificVarietyDetailsQuery,
  useUpdateProductVarietyMutation,
  useGetProductDetailsByProductIdQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useDeleteVarietyMutation,
  useDeleteOrderMutation,
  useGetAllUserQuery,
  useGetAllOrderQuery
  
} = productApi;
