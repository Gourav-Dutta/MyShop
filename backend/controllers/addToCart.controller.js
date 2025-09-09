import { PrismaClient } from "@prisma/client";
import { parse, z } from "zod";
const prisma = new PrismaClient();

const addToCartSchema = z.object({
  productVarietyId: z.string().min(1, "Product Variety Id is compulsory"),
  quantity: z.string().optional(),
});
async function handleAddToCart(req, res) {
  try {
    const userId = parseInt(req.user.id);

    const body = addToCartSchema.parse(req.body);
    body.productVarietyId = parseInt(body.productVarietyId);
    body.quantity = parseInt(body.quantity);

    const existingerUserProduct = await prisma.add_To_Cart.findMany({
      // Checking if the combination already exists
      // findMany always return an array, In this case even there is no combination findMany always return an empty array. IN Jabascript even an empty array/not-null object also consider as true.
      where: {
        user_id: userId,
        productVariety_id: body.productVarietyId,
      },
    });

    // console.log(existingerUserProduct);

    if (existingerUserProduct.length > 0) {
      return res.status(400).json({
        Message: `Hello  ${req.user.name}, you already added this product to your Add To Cart table kindle increase the equantity of that product or try with another one`,
      });
    }

    const addToCart = await prisma.add_To_Cart.create({
      data: {
        user_id: userId,
        productVariety_id: body.productVarietyId,
        quantity: body.quantity || 1,
      },
      include: { productVariety: true, user: true },
    });

    if (!addToCart) {
      return res.status(400).json({
        message:
          "An error occured during inserting values in ADD-TO-CART Table",
      });
    }

    return res.json({
      message: "Successfully inserted values in Add-To-Cart Table",
      data: addToCart,
    });
  } catch (err) {
    return res.status(500).json({
      Message: `An internal server error : ${err.message}`,
    });
  }
}

const updateAddToCartSchema = z.object({
  productVarietyId: z.string().min(1, "Product Variety Id is compulsory"),
  quantity: z.string().min(1, "Quantity is compulsory"),
});

async function handleUpdateAddToCart(req, res) {
  try {
    const userId = parseInt(req.user.id);

    const body = updateAddToCartSchema.parse(req.body);
    body.productVarietyId = parseInt(body.productVarietyId);
    body.quantity = parseInt(body.quantity);

    const updateValue = await prisma.add_To_Cart.updateMany({
      where: {
        user_id: userId,
        productVariety_id: body.productVarietyId,
      },
      data: {
        quantity: body.quantity,
      },
    });

    console.log(updateValue);

    if (updateValue.count === 0) {
      return res.status(400).json({
        message: "Update is not successfully",
      });
    }

    return res.status(200).json({
      message: "Update is  successfully",
      updatedData: updateValue,
    });
  } catch (err) {
    return res.status(500).json({
      Message: `An internal server error : ${err.message}`,
    });
  } finally {
    await prisma.$disconnect();
  }
}

// Delete product using userId and productId
const deleteAddToCartSchema = z.object({
  productVarietyId: z.string().min(1, "Product Variety Id is compulsory"),
});

async function handleDeleteOneProduct(req, res) {
  try {
    const userId = parseInt(req.user.id);
    const body = deleteAddToCartSchema.parse(req.body);

    const productVarietyId = parseInt(body.productVarietyId);

    const user = await prisma.add_To_Cart.deleteMany({
      where: {
        user_id: userId,
        productVariety_id: productVarietyId,
      },
    });

    if (user.count === 0) {
      return res.status(400).json({
        message: "user deleted with product is not successfully",
      });
    }

    return res.status(200).json({
      message: "user deleted with product is  successfully",
      deletedData: user,
    });
  } catch (err) {
    return res.status(500).json({
      Message: `An internal server error : ${err.message}`,
    });
  }
}

// Get add to card based on the userId

async function handleGetAddToCartValue(req, res) {
  try {
    const userId = parseInt(req.user.id);
    // console.log(userId);

    const products = await prisma.add_To_Cart.findMany({
      where: { user_id: userId },
      include: {
        productVariety: {
          include: {
            product: true,
            images: true,
          },
        },
      },
    });

    if (!products) {
      return res.status(400).json({
        message: "No data found",
      });
    }

    return res.status(200).json({
      message: "Successfully get All data",
      data: products,
    });
  } catch (err) {
    return res.status(500).json({
      Message: `An internal server error : ${err.message}`,
    });
  }
}

export {
  handleAddToCart as addToCartFunction,
  handleDeleteOneProduct as deleteUserWithProduct,
  handleUpdateAddToCart as updateAddToCart,
  handleGetAddToCartValue as getAddToCartValue,
};
