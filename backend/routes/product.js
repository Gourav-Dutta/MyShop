import { Router } from "express";
import { newProductEntryFunction,
         getProductByTheLoginSeller,
         getAllProductFunction,
         getProductByUserId,
         getProductBySub_Category,
         updateProductByProduct_Id,
         deleteProductByProduct_Id,
         deleteProductBySub_name,
         getProductByMain_Category,
         getProductByProductId,
         getProductByBrandId
       } from "../controllers/product.controller.js";
import { sellerAdminMiddleware, authMiddleware, adminMiddleware } from "../middleware/auth.js";
const router = Router();


// Product Routes
router
.post("/seller/entry", authMiddleware,  sellerAdminMiddleware(["ADMIN", "SELLER"]), newProductEntryFunction )
.get("/seller/get", authMiddleware, sellerAdminMiddleware(["ADMIN", "SELLER"]), getProductByTheLoginSeller)
// .get("/product/getAll", authMiddleware, adminMiddleware, getAllProductFunction )
.get("/product/getAll" , getAllProductFunction )
.get("/product/getOne/:UserId", authMiddleware, adminMiddleware, getProductByUserId)
.get("/product/sub_category/:sub_category_name", authMiddleware, adminMiddleware, getProductBySub_Category)
// .get("/product/main_category/:main_category_name", authMiddleware, adminMiddleware, getProductByMain_Category)
.get("/product/main_category/:main_category_name",  getProductByMain_Category)
.get("/product/:productId", getProductByProductId )
.get("/product/brand/:brandId", getProductByBrandId)
.patch("/product/update/:product_id", authMiddleware, sellerAdminMiddleware(["ADMIN", "SELLER"]), updateProductByProduct_Id)
.delete("/product/delete/:product_id", authMiddleware, sellerAdminMiddleware(["ADMIN", "SELLER"]), deleteProductByProduct_Id)
.delete("/product/delete_sub/:sub_id_name", authMiddleware, sellerAdminMiddleware(["ADMIN", "SELLER"]), deleteProductBySub_name)

// Variety Routes

// router.post("/variety/entry/:productId", authMiddleware, sellerAdminMiddleware(["ADMIN", "SELLER"]), newVarietyEntryFunction);
export {
    router as productRouter
}