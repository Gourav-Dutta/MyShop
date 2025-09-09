import { PrismaClient } from "@prisma/client";
import { z } from "zod";
const prisma = new PrismaClient();

// Post order :

// Creating order details schema
const orderSchema = z.object({
  status: z.string().optional(),
  items: z
    .array(
      z.object({
        productVariety_id: z
          .string()
          .min(1, "Product variety Id is must needed"),
        price: z.string().min(1, "Price is needed"),
        quantity: z.string().optional(),
      })
    )
    .min(1, "At least one Product is compulsory to place order"),
});

async function handleInsertOrder(req, res) {
  try {
    const body = orderSchema.parse(req.body);
    const userId = req.user.id;
    const total_price = body.items.reduce((sum, item) => {
      const price = parseInt(item.price);
      const quantity = parseInt(item.quantity) || 1;
      return sum + price * quantity;
    }, 0);

    // console.log(req.user);
    // console.log(body);
    // body.items.map( (item) => {
    //     console.log(item.price);

    // })
    // console.log(total_price);

    const orderDetails = await prisma.order.create({
      data: {
        user: { connect: { id: parseInt(userId) } },
        status: body.status,
        total_price: parseInt(total_price),

        items: {
          create: body.items.map((item) => ({
            productVariety_id: parseInt(item.productVariety_id),
            price: parseInt(item.price),
            quantity: parseInt(item.quantity) || 1,
          })),

          // If the user place two order it will look like

          // items : {
          //     create : [
          //         { product_id : parseInt(product_id), price : parseInt(price), quantity : parseInt(quantity)},
          //         { product_id : parseInt(product_id), price : parseInt(price), quantity : parseInt(quantity)},
          //     ]
          // }
        },
      },
      include: { items: true },
    });

    if (!orderDetails) {
      return res.status(400).json({
        message: "Something wrong in insrting order details",
      });
    }

    return res.status(201).json({
      message: "Order details inserted successfully",
      data: orderDetails,
    });
  } catch (err) {
    console.log(err.message);

    return res.status(500).json({
      message: `An error occured : ${err.message}`,
    });
  }
}

// Get order details :

// Get order details by orderId
async function handleGetOrderByOrder_Id(req, res) {
  try {
    const orderId = parseInt(req.params.orderId);

    const orderDetails = await prisma.order.findMany({
      where: { id: orderId },
      include: { items: true },
    });

    if (!orderDetails) {
      return res.status(400).json({
        message: "Some error occured at get order details",
      });
    }

    return res.status(200).json({
      message: "Successfully get Order details",
      data: orderDetails,
    });
  } catch (err) {
    return res.status(500).json({
      message: `An error occured ${err.message}`,
    });
  } finally {
    await prisma.$disconnect();
  }
}

// Get All order details
async function handleGetAllOrder(req, res) {
  try {
    const orders = await prisma.order.findMany({
      include: { items: true },
    });

    if (!orders) {
      return res.status(400).json({
        message: "Oreder are not geted",
      });
    }

    return res.status(200).json({
      message: "Oreder details get successfully",
      orders: orders,
    });
  } catch (err) {
    return res.status(500).json({
      message: `An error occured ${err.message}`,
    });
  } finally {
    await prisma.$disconnect();
  }
}

// Get order details by user Id
async function handleGetOredrByUserId(req, res) {
  try {
    const userId = parseInt(req.user.id);

    const order = await prisma.order.findMany({
      // findMany always return an Array . So order here is nothing but an array of object
      where: {
        user_id: userId,
      },
      include: { items: true },
    });

    if (!order) {
      return res.status(400).json({
        message: "User is not found",
      });
    }

    if (order.length === 0) {
      return res.status(400).json({
        message: "You does't place any order till now",
      });
    }

    return res.status(200).json({
      message: "Order details get successfully",
      data: order,
    });
  } catch (err) {
    return res.status(500).json({
      message: `An error occured ${err.message}`,
    });
  } finally {
    await prisma.$disconnect();
  }
}

// Get order details by product Variety Id
async function handleGetOrderByProductVarietyId(req, res) {
  try {
    const productVariety_Id = parseInt(req.params.productVariety_Id);

    const order = await prisma.order.findMany({
      where: {
        items: {
          some: { productVariety_id: productVariety_Id },
        },
      },
      // include : { items :
      //           {
      //            include : { product :
      //                 {
      //                 include :
      //                 {
      //                     sub_category :
      //                     {
      //                       include : {main_category : true}
      //                     }
      //                 }
      //                 }
      //            }
      //           }
      //         }
    });

    if (order.length === 0) {
      return res.status(400).json({
        message: "Order details are not getted successfully",
      });
    }

    return res.status(200).json({
      message: "Order details are gatted successfully ",
      data: order,
      // "data" : order[0].items[0].product .sub_category.main_category.name
    });
  } catch (err) {
    return res.status(500).json({
      message: `An error occured ${err.message}`,
    });
  } finally {
    await prisma.$disconnect();
  }
}

// Get all order details by Date

async function handleGetOrderByDate(req, res) {
  try {
    const date = req.body.date;
    const istOffset = 5.5 * 60 * 60 * 1000; // 5h 30m in ms

    const startOfDay = new Date(new Date(date).getTime() + istOffset);         // getTime -- > convert the time into milisecond 
    startOfDay.setUTCHours(0, 0, 0, 0); // Start at IST midnight
    // console.log(startOfDay.toISOString());
    // console.log(startOfDay.toString());
    //  Start Date = 2025.08.08  -> 2025-08-08T00:00:00.000  -> From the starting of 2025.08.08 Time 12.00.00.000 AM  (IST).

    const endOfDay = new Date(startOfDay);
    endOfDay.setUTCHours(23, 59, 59, 999); // End of IST day
    // End Date -> 2025-08-08T23:59:59.999   -> 2025.08.08 Time 11.59.59.999 PM
    console.log(startOfDay);
    console.log(endOfDay);

    const orders = await prisma.order.findMany({
      where: {
        order_at: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },

      include: { items: true },
    });

    if (!orders) {
      return res.status(400).json({
        Message: "Order Date is not found",
      });
    }

    if (orders.length === 0) {
      return res.status(200).json({
        Message: "No order placed on that date ",
      });
    }

    return res.status(200).json({
      Message: "Order deatils are gated successfully",
      "order-details": orders,
    });
  } catch (err) {
    return res.status(500).json({
      Message: `An internal server error occured during get order details based on date : ${err.message}`,
    });
  } finally {
    await prisma.$disconnect();
  }
}

// Delete order :

// Delete Order by order ID
async function handleDeleteOrderByOrderId(req, res) {
  try {
    const orderId = parseInt(req.params.orderId);

    const deletedOrder = await prisma.order.delete({
      where: { id: orderId },
      include: { items: true },
    });

    if (!deletedOrder) {
      return res.status(400).json({
        Message: "Order not founded",
      });
    }

    return res.status(200).json({
      Message: "Deleted order details successfully get",
      "order-details": deletedOrder,
    });
  } catch (err) {
    return res.status(500).json({
      message: `An error occured during deleteing a order : ${err.message}`,
    });
  } finally {
    await prisma.$disconnect();
  }
}

// Delete order by User ID

async function handleDeleteOrderByUserId(req, res) {
  try {
    const userId = parseInt(req.user.id);

    const deletedOrder = await prisma.order.deleteMany({
      where: { user_id: userId },
    });

    if (!deletedOrder) {
      return res.status(400).json({
        Message: "User not founded",
      });
    }

    return res.status(200).json({
      Message: "Deleted order details successfully get",
      "order-details": deletedOrder,
    });
  } catch (err) {
    return res.status(500).json({
      message: `An error occured during deleteing a order : ${err.message}`,
    });
  } finally {
    await prisma.$disconnect();
  }
}

// Delete order by Product ID
async function handleDeleteOrderByProductVarietyId(req, res) {
  try {
    const productVariety_Id = parseInt(req.params.productVariety_id);

    const deletedOrder = await prisma.order.deleteMany({
      where: {
        items: {
          some: { productVariety_id: productVariety_Id },
        },
      },
      // In the case of delete , include only work with delete not with deleteMany
    });

    if (!deletedOrder) {
      return res.status(400).json({
        Message: "User not founded",
      });
    }

    return res.status(200).json({
      Message: "Deleted order details successfully get",
      "order-details": deletedOrder,
    });
  } catch (err) {
    return res.status(500).json({
      message: `An error occured during deleteing a order : ${err.message}`,
    });
  } finally {
    await prisma.$disconnect();
  }
}

// Update order Status :

async function handleUpdateOrderStatus(req, res) {
  try {
    const updateData = {};
    const { status, orderId } = req.body;

    if (status) updateData.status = status;

    // const {status, orderId} = req.body;

    const orderDetails = await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: {
        status: updateData.status,
        // status : status
        // ...updateData
      },
      include: { items: true },
    });

    if (!orderDetails) {
      return res.status(400).json({
        Message: "Order not found",
      });
    }

    return res.status(200).json({
      message: "Order status updated successfully",
      updatedData: orderDetails,
    });
  } catch (err) {
    return res.status(500).json({
      message: "An internal server error during update order status",
      error: `The error is : ${err.message}`,
    });
  } finally {
    await prisma.$disconnect();
  }
}

// Delete order by Order Date :
async function handleDeleteOrderByDate(req, res) {
  try {
    const date = req.body.date;
    const istOffset = 5.5 * 60 * 60 * 1000; // 5h 30m in ms

    const startOfDay = new Date(new Date(date).getTime() + istOffset);      // Modifying UTC in order to IST    
    startOfDay.setUTCHours(0, 0, 0, 0); 

    const endOfDay = new Date(startOfDay);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const orders = await prisma.order.deleteMany({
      where: {
        order_at: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    if (!orders) {
      return res.status(400).json({
        message: "No date found",
      });
    }

    if (orders.count === 0) {
      return res.status(200).json({
        message: "No order found on that data",
      });
    }

    return res.status(200).json({
      Message: "Order deleted Successfully",
      "Order-Details": orders,
    });
  } catch (err) {
    return res.status(500).json({
      Message: `An internal server error occured during get order details based on date : ${err.message}`,
    });
  } finally {
    await prisma.$disconnect();
  }
}

export {
  handleInsertOrder as insertOrderFunction,
  handleGetAllOrder as getAllOrderFunction,
  handleGetOrderByOrder_Id as getAllOrderByOrderId,
  handleGetOrderByProductVarietyId as getAllOrderByProductVarietyId,
  handleGetOredrByUserId as getAllOrderByUserId,
  handleDeleteOrderByOrderId as deleteOrderByOrderId,
  handleDeleteOrderByProductVarietyId as deleteOrderByProductVarietyId,
  handleDeleteOrderByUserId as deleteOrderByUserID,
  handleUpdateOrderStatus as updateOrderStatus,
  handleGetOrderByDate as getOrderDetailsByDate,
  handleDeleteOrderByDate as deleteOrderByDate,
};
