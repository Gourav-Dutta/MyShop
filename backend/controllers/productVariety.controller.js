import { PrismaClient } from "@prisma/client";
import { z } from "zod";


const prisma = new PrismaClient();

// 1. iNSERT PRODUCT VARIETY

// Insert Product - Variety  -- Admin and seller only

const varietySchema = z.object({
  sku: z.string().min(1, "SKU is must needed"),
  color: z.string().optional(),
  size: z.string().optional(),
  weight: z.string().optional(),
  liter: z.string().optional(),
  price: z.string().min(1, "Price is must needed"),
  stock: z.string().min(1, "Please provide stock quantity"),
  name: z.string().min(1, "A Product variety name is must neede"),
});

async function handleVarietyEntery(req, res) {
  const body = varietySchema.parse(req.body);
  body.price = parseInt(body.price);
  body.stock = parseInt(body.stock);
  body.productId = parseInt(req.params.productId);
  console.log(body);

  try {
    const findProduct = await prisma.product.findUnique({
      where: { id: body.productId },
    });

    if (!findProduct) {
      return res.status(400).json({
        message: "No product find with the given productId",
      });
    }
    console.log("Product found");

    const newVariety = await prisma.product_Variety.create({
      data: {
        color: body.color || null,
        size: body.size || null,
        weight: body.weight || null,
        liter: body.liter || null,
        sku: body.sku,
        price: body.price,
        name: body.name,
        stock: body.stock,
        product: {
          connect: { id: body.productId },
        },
      },
      include: { product: true },
    });

    if (!newVariety) {
      res.status(400).json({
        message: "Failed to enter new variety",
      });
    }

   
    return res.status(201).json({
      message: "New variety entered successfully",
      data: newVariety,
    });
  } catch (err) {
    return res.status(500).json({
      Message: `An error occured durting enter new variety of  product : ${err.message}`,
    });
  }
}

// 2 . GET PRODUCT VARIETY

// Get product variety by product Id  --- Admin and seller only

async function handleGetProductVarietyByProductId(req, res) {
  try {
    const productId = parseInt(req.params.productId);

    const Products = await prisma.product_Variety.findMany({
      where: { productId: productId },
      include: {
        images: true,
        product: {
          include: {
            product_offers: {
              include: {
                offer: true,
              },
            },
          },
        },
      },
    });

    if (Products.length === 0) {
      return res.status(404).json({
        message: "No variety found of this product",
      });
    }

    return res.status(200).json({
      message: "Product variety fetched successfully",
      data: Products,
    });
  } catch (err) {
    return res.status(500).json({
      Message: `An error occured durting enter found variety of product : ${err.message}`,
    });
  }
}

// Get product variety of products by user ID of the particular seller  --    seller only

async function handleGetVarietyByThatSeller(req, res) {
  try {
    const sellerId = parseInt(req.params.sellerId);

    const Products = await prisma.product_Variety.findMany({
      where: {
        product: {
          user_id: sellerId,
        },
      },
      include: { product: true },
    });

    if (Products.length === 0) {
      return res.status(404).json({
        message: "No variety found of yours",
      });
    }

    return res.status(200).json({
      message: "Product variety fetched successfully",
      data: Products,
    });
  } catch (err) {
    return res.status(500).json({
      Message: `An error occured durting enter found variety of product : ${err.message}`,
    });
  }
}

// Get variety by seller Id by Admin -- Admin only

async function handleGetVarietyUsingSellerIdByAdmin(req, res) {
  try {
    const sellerId = parseInt(req.body.sellerId);

    const Products = await prisma.product_Variety.findMany({
      where: {
        product: {
          user_id: sellerId,
        },
      },
      include: { product: true },
    });

    if (Products.length === 0) {
      return res.status(404).json({
        message: "No variety found of that seller",
      });
    }

    return res.status(200).json({
      message: "Product variety fetched successfully",
      data: Products,
    });
  } catch (err) {
    return res.status(500).json({
      Message: `An error occured durting enter found variety of product : ${err.message}`,
    });
  }
}

// Get Product variety by product-variety Id

async function handleGetVarietyByVarietyId(req, res) {
  try {
    const varietyId = parseInt(req.params.varietyId);

    const Products = await prisma.product_Variety.findUnique({
      where: {
        id: varietyId,
      },
      include: { product: true },
    });

    if (Products.length === 0) {
      return res.status(404).json({
        message: "No variety found of yours",
      });
    }

    return res.status(200).json({
      message: "Product variety fetched successfully",
      data: Products,
    });
  } catch (err) {
    return res.status(500).json({
      Message: `An error occured durting enter found variety of product : ${err.message}`,
    });
  }
}

// Get All Products Variety  -- Admin only

async function handleGetAllVariety(req, res) {
  try {
    const Products = await prisma.product_Variety.findMany({
      include: { product: true },
    });

    if (Products.length === 0) {
      return res.status(404).json({
        message: "No variety found of yours",
      });
    }

    return res.status(200).json({
      message: "Product variety fetched successfully",
      data: Products,
    });
  } catch (err) {
    return res.status(500).json({
      Message: `An error occured durting enter found variety of product : ${err.message}`,
    });
  }
}

// 3. UPDATE PRODUCT VARIETY

// Update product variety by product Variety ID --  seller only

async function handleUpdateVarietyByVarietyIdOfThatSeller(req, res) {
  try {
    const sellerId = parseInt(req.params.sellerId);
    const varietyId = parseInt(req.body.varietyId);
    const { color, size, product_id, weight, liter, price, sku, stock } =
      req.body;
    const updateData = {};
    if (color) updateData.color = color;
    if (size) updateData.size = size;
    if (product_id) updateData.product_id = product_id;
    if (weight) updateData.weight = weight;
    if (liter) updateData.liter = liter;
    if (price) updateData.price = price;
    if (sku) updateData.sku = sku;
    if (stock) updateData.stock = stock;

    const variety = await prisma.product_Variety.findFirst({
      where: { id: varietyId, product: { user_id: sellerId } },
    });

    if (!variety) return res.status(403).json({ message: "Unauthorized" });

    const product = await prisma.product_Variety.update({
      where: { id: varietyId },
      data: updateData,
    });

    if (!product) {
      return res.status(400).json({
        message: "Failed to update data",
      });
    }

    return res.status(200).json({
      message: "Successfully Updated Product",
      product: product,
    });
  } catch (err) {
    return res.status(500).json({
      Message: `An error occured durting get update  product : ${err.message}`,
    });
  }
}

// update product variety by product variety Id by Admin  -- Admin only

async function handleUpdateVarietyByVarietyIdByAdmin(req, res) {
  try {
    const varietyId = parseInt(req.params.varietyId);
    const { color, size, product_id, weight, liter, price, sku, stock } =
      req.body;
    const updateData = {};
    if (color) updateData.color = color;
    if (size) updateData.size = size;
    if (product_id) updateData.product_id = product_id;
    if (weight) updateData.weight = weight;
    if (liter) updateData.liter = liter;
    if (price) updateData.price = price;
    if (sku) updateData.sku = sku;
    if (stock) updateData.stock = stock;

    const product = await prisma.product_Variety.update({
      where: { id: varietyId },
      data: updateData,
    });

    if (!product) {
      return res.status(400).json({
        message: "Failed to update data",
      });
    }

    return res.status(200).json({
      message: "Successfully Updated Product",
      product: product,
    });
  } catch (err) {
    return res.status(500).json({
      Message: `An error occured durting get update  product : ${err.message}`,
    });
  }
}

// 4. DELETE PRODUCT VARIETY

// Delete Product Variety by product Variety Id -- seller only

async function handleDeleteVarietyByVarietyIdOfThatSeller(req, res) {
  try {
    const sellerId = parseInt(req.params.sellerId);
    const varietyId = parseInt(req.body.varietyId);

    const variety = await prisma.product_Variety.findFirst({
      where: { id: varietyId, product: { user_id: sellerId } },
    });

    if (!variety)
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
    const product = await prisma.product_Variety.deleteMany({
      where: {
        id: varietyId,
      },
    });

    if (!product) {
      return res.status(400).json({
        message: "Failed to update data",
      });
    }

    return res.status(200).json({
      message: "Successfully Updated Product",
      product: product,
    });
  } catch (err) {
    return res.status(500).json({
      Message: `An error occured durting get update  product : ${err.message}`,
    });
  }
}

// Delete product variety by product variety ID by Admin --- Admin only

async function handleDeleteVarietyByVarietyIdByAdmin(req, res) {
  try {
    const varietyId = parseInt(req.params.varietyId);

    const product = await prisma.product_Variety.deleteMany({
      where: {
        id: varietyId,
      },
    });

    if (!product) {
      return res.status(400).json({
        message: "Failed to update data",
      });
    }

    return res.status(200).json({
      message: "Successfully Updated Product",
      product: product,
    });
  } catch (err) {
    return res.status(500).json({
      Message: `An error occured durting get update  product : ${err.message}`,
    });
  }
}

export {
  handleVarietyEntery as insertProductVariety,
  handleGetProductVarietyByProductId as getProductVarietyByProductId,
  handleGetVarietyByThatSeller as getVarietyByThatSeller,
  handleGetAllVariety as getAllProductVariety,
  handleGetVarietyUsingSellerIdByAdmin as getVarietyUsingSellerIdByAdmin,
  handleGetVarietyByVarietyId as getVarietyByVarietyId,
  handleUpdateVarietyByVarietyIdOfThatSeller as updateVarietyByVarietyIdOfThatSeller,
  handleUpdateVarietyByVarietyIdByAdmin as updateVarietyByVarietyId,
  handleDeleteVarietyByVarietyIdOfThatSeller as deleteVarietyByVarietyBySeller,
  handleDeleteVarietyByVarietyIdByAdmin as deleteVarietyByVarietyByAdmin,
};
