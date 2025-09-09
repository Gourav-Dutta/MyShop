import {Router} from 'express';
import {
        InsertImageFunction,
        GetImageByVarietyIdFunction,
        UpdateImageByAdminFunction,
        UpdateImageByTheSellerFunction,
        DeleteImageByTheSellerFunction,
        DeleteImageByAdminFunction
} from "../controllers/productImage.controller.js";
import {
        authMiddleware,
        adminMiddleware,
        sellerAdminMiddleware
} from "../middleware/auth.js";





const router = Router();



router
.post("/image/upload", authMiddleware, sellerAdminMiddleware(["ADMIN", "SELLER"]),InsertImageFunction )
.get("/image/variety/:varietyId", GetImageByVarietyIdFunction)
.patch('/image/update/admin', authMiddleware, adminMiddleware, UpdateImageByAdminFunction)
.patch("/image/update/seller/:sellerId", authMiddleware, sellerAdminMiddleware(["SELLER"]), UpdateImageByTheSellerFunction)
.delete("/image/delete/seller/:sellerId", authMiddleware, sellerAdminMiddleware(["Seller"]), DeleteImageByTheSellerFunction)
.delete("/image/delete/admin", authMiddleware, adminMiddleware, DeleteImageByAdminFunction)


export {
    router as productImageRouter
}