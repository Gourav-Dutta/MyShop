import Router from 'express';
import { insertOrderFunction,
        getAllOrderByProductVarietyId,
        getAllOrderByUserId,
        getAllOrderFunction,
        getAllOrderByOrderId,
        deleteOrderByOrderId,
        deleteOrderByProductVarietyId,
        deleteOrderByUserID,
        updateOrderStatus,
        getOrderDetailsByDate,
        deleteOrderByDate
       } from '../controllers/order.js';
import {authMiddleware,
        sellerAdminMiddleware,
        adminMiddleware
       } from '../middleware/auth.js'
const router = Router();


router
.post("/order/newOrder", authMiddleware, insertOrderFunction)
.get("/order/getAll", authMiddleware, adminMiddleware, getAllOrderFunction)
.get("/order/userId", authMiddleware,  getAllOrderByUserId)
.get("/order/orderId/:orderId", authMiddleware, sellerAdminMiddleware(["ADMIN", "SELLER"]), getAllOrderByOrderId)
.get("/order/productVarietyId/:productVariety_Id", authMiddleware, sellerAdminMiddleware(["ADMIN", "SELLER"]), getAllOrderByProductVarietyId)
.get("/order/date", authMiddleware, adminMiddleware, getOrderDetailsByDate)
.patch("/order/status", authMiddleware, sellerAdminMiddleware(["ADMIN", "SELLER"]), updateOrderStatus )
.delete("/order/orderId/:orderId", authMiddleware, sellerAdminMiddleware(["ADMIN", "SELLER"]), deleteOrderByOrderId)
.delete("/order/userId", authMiddleware, deleteOrderByUserID)
.delete("/order/productVarietyId/:productVariety_Id", authMiddleware, sellerAdminMiddleware(["ADMIN", "SELLER"]), deleteOrderByProductVarietyId)
.delete("/order/date", authMiddleware, adminMiddleware, deleteOrderByDate)
 




export {router as orderRouter}


