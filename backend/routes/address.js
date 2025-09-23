import { Router } from "express";
import {
  adminMiddleware,
  authMiddleware,
  sellerAdminMiddleware,
} from "../middleware/auth.js";
import {
  addNewAddress,
  getAllUserByCityName,
  getAlluserAddress,
  getUserAddress,
  getUserAddressByAdmin,
  GetAddressOnAddIdUserId,
  UpdateAddress,
  updateAddressIs_Primary
} from "../controllers/address.controller.js";

const router = Router();

router
  .post("/address/new", authMiddleware, addNewAddress)
  .get("/address/city", authMiddleware, adminMiddleware, getAllUserByCityName)
  .get("/address/getAll", authMiddleware, getAlluserAddress)
  .get("/address/user", authMiddleware, getUserAddress)
  .get(
    "/address/Oneuser",
    authMiddleware,
    adminMiddleware,
    getUserAddressByAdmin
  )
  .get("/add/addId/userId/:addId", authMiddleware, GetAddressOnAddIdUserId)
  .patch("/update/Address/:addId", authMiddleware, UpdateAddress)
  .put("/update/Address/is_primary", authMiddleware, updateAddressIs_Primary )

export { router as addressRouter };
