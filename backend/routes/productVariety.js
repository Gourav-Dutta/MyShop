import {Router} from 'express';
import {
        insertProductVariety,
        getAllProductVariety,
        getProductVarietyByProductId,
        getVarietyByThatSeller,
        getVarietyByVarietyId,
        getVarietyUsingSellerIdByAdmin,
        updateVarietyByVarietyId,
        updateVarietyByVarietyIdOfThatSeller,
        deleteVarietyByVarietyBySeller,
        deleteVarietyByVarietyByAdmin

} from "../controllers/productVariety.controller.js";
import {
        authMiddleware,
        adminMiddleware,
        sellerAdminMiddleware
} from "../middleware/auth.js";

const router = Router();




router
.post("/variety/entry/:productId", authMiddleware, sellerAdminMiddleware(["ADMIN", "SELLER"]), insertProductVariety)
.get("/variety/all", getAllProductVariety)
.get("/variety/product/:productId", getProductVarietyByProductId)
.get("/variety/seller/:sellerId", authMiddleware, sellerAdminMiddleware(["SELLER"]), getVarietyByThatSeller)
.get("/variety/varietyId/:varietyId", getVarietyByVarietyId)
.get("/variety/admin/seller", authMiddleware, adminMiddleware, getVarietyUsingSellerIdByAdmin)
.patch("/variety/update/seller/:sellerId", authMiddleware, sellerAdminMiddleware(["SELLER"]), updateVarietyByVarietyIdOfThatSeller)
.patch("/variety/update/admin/:varietyId", authMiddleware, adminMiddleware, updateVarietyByVarietyId)
.delete("/variety/delete/seller/:sellerId", authMiddleware, sellerAdminMiddleware(["SELLER"]), deleteVarietyByVarietyBySeller)
.delete('/variety/delete/admin/:varietyId', authMiddleware, adminMiddleware, deleteVarietyByVarietyByAdmin)










export {
    router as productVarietyRouter
}