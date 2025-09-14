import {
        getAllProductByBrand,
        insertNewBrand,
        getAllBrand,
        updateBrand,
        deleteBrand
 } from '../controllers/brand.controller.js';
import {Router} from "express";
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';



const router = Router();



router
.post("/brand/entry", authMiddleware, adminMiddleware, insertNewBrand)
.get("/brand/products/:brandName", authMiddleware, adminMiddleware, getAllProductByBrand)
.get("/brand/all", getAllBrand)
.patch("/brand/update/:brandId", authMiddleware, adminMiddleware, updateBrand)
.delete("/brand/delete/:branbdId", authMiddleware, adminMiddleware, deleteBrand)



export { 
    router as brandRouter
}