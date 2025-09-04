import {Router} from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { addToCartFunction, updateAddToCart, deleteUserWithProduct } from "../controllers/addToCart.controller.js";


const router = Router();


router
.post("/user/addToCart", authMiddleware, addToCartFunction)
.patch("/user/addToCart/update", authMiddleware , updateAddToCart )
.delete("/user/addToCart/delete", authMiddleware, deleteUserWithProduct)




export { router as addToCartRouter}