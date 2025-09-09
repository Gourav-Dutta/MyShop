import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import { productApi } from "./slice/productSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [productApi.reducerPath]: productApi.reducer,
  },
  devTools: true,
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    productApi.middleware,
  ],
});
