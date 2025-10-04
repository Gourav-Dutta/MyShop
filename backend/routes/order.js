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
        deleteOrderByDate,
        GetOrderItemBySeller
       } from '../controllers/order.controller.js';
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
.get("/orderItem/seller", authMiddleware, sellerAdminMiddleware(["SELLER", "ADMIN"]), GetOrderItemBySeller)
.patch("/order/status/:orderItemId", authMiddleware, sellerAdminMiddleware(["ADMIN", "SELLER"]), updateOrderStatus )
.delete("/order/orderId/:orderId", authMiddleware, deleteOrderByOrderId)
.delete("/order/userId", authMiddleware, deleteOrderByUserID)
.delete("/order/productVarietyId/:productVariety_Id", authMiddleware, sellerAdminMiddleware(["ADMIN", "SELLER"]), deleteOrderByProductVarietyId)
.delete("/order/date", authMiddleware, adminMiddleware, deleteOrderByDate)
 




export {router as orderRouter}


