import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  addToCartFunction,
  updateAddToCart,
  deleteUserWithProduct,
  getAddToCartValue,
} from "../controllers/addToCart.controller.js";

const router = Router();

router
  .post("/user/addToCart", authMiddleware, addToCartFunction)
  .get("/user/addToCart/getProduct", authMiddleware, getAddToCartValue)
  .patch("/user/addToCart/update", authMiddleware, updateAddToCart)    
  .delete("/user/addToCart/delete", authMiddleware, deleteUserWithProduct);       // For delete addToCart

export { router as addToCartRouter };
