import {Router} from 'express';
import {
        InsertImageFunction,
        GetImageByVarietyIdFunction,
        UpdateImageByTheSellerFunction,
        DeleteImageByTheSellerFunction,
        DeleteImageByAdminFunction
} from "../controllers/productImage.controller.js";
import {
        authMiddleware,
        adminMiddleware,
        sellerAdminMiddleware
} from "../middleware/auth.js";
import { upload } from '../middleware/multer.js';





const router = Router();



router
.post("/image/upload/:varietyId",upload.array("images"), authMiddleware, sellerAdminMiddleware(["ADMIN", "SELLER"]),InsertImageFunction )
.get("/image/variety/:varietyId", GetImageByVarietyIdFunction)
.patch("/image/update/seller/:sellerId", upload.single("image"), authMiddleware, sellerAdminMiddleware(["SELLER"]), UpdateImageByTheSellerFunction)
.delete("/image/delete/seller/:sellerId", authMiddleware, sellerAdminMiddleware(["Seller"]), DeleteImageByTheSellerFunction)
.delete("/image/delete/admin", authMiddleware, adminMiddleware, DeleteImageByAdminFunction)


export {
    router as productImageRouter
}