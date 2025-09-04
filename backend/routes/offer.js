import {
  InsertNewOffer,
  UpdateOffer,
  DeleteOffer,
  GetAllOffer,
  GetOfferOnOfferId,
  ProductOfferTableInsertation,
  updateProductOfferCombination,
  getAllProductOfferCombo,
  getSpecificProductOfferCombo,
  deleteProductOfferCombo
} from "../controllers/offer.controller.js";
import { authMiddleware, adminMiddleware, sellerAdminMiddleware } from "../middleware/auth.js";
import { Router } from "express";
const router = Router();

router
  .post("/offer/new",authMiddleware, adminMiddleware, InsertNewOffer)
  .get("/offer/GetAll",authMiddleware,sellerAdminMiddleware(["SELLER", "ADMIN"]), GetAllOffer)
  .get("/offer/GetOne/:offerId",authMiddleware,sellerAdminMiddleware(["SELLER", "ADMIN"]), GetOfferOnOfferId)
  .patch("/offer/update/:offerId",authMiddleware, adminMiddleware, UpdateOffer)
  .delete("/offer/delete/:offerId",authMiddleware, adminMiddleware, DeleteOffer);

  // Product Offer Table

router
.post("/productOffer/new", authMiddleware, sellerAdminMiddleware(["SELLER"]), ProductOfferTableInsertation)
.patch("/update/productOffer/:productId/:offerId",authMiddleware, sellerAdminMiddleware(["SELLER"]), updateProductOfferCombination)
.get("/productOffer/All", getAllProductOfferCombo)
.get("/product/Get/One/:productId/:offerId", getSpecificProductOfferCombo)
.delete("/delete/:productId/:offerId", authMiddleware, sellerAdminMiddleware(["SELLER"]), deleteProductOfferCombo)


export { router as offerRouter };
