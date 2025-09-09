import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Insert :

// Insert Product Image Schema

const imageSchema = z.object({
  varietyId: z.string().min(1, "Product Varitey Id is mendatory"),
  url: z
    .string()
    .url("Image must be a valid URL")
    .min(1, "Image URL is mendatory"),
  alt_text: z.string().min(1, "Alt text is mendatory"),
  is_primary: z.string().optional(),
});

// Insert Product Image

async function handleInsertImage(req, res) {
  try {
    const body = imageSchema.parse(req.body);
    body.varietyId = parseInt(body.varietyId);

    if (typeof body.is_primary === "string") {
      if (body.is_primary.toLowerCase() === "true") {
        body.is_primary = true;
      } else if (body.is_primary.toLowerCase() === "false") {
        body.is_primary = false;
      } else {
        throw new Error(
          "This is a Invalid Boolean value, kindly use 'true' or 'false' "
        );
      }
    }

    const productImage = await prisma.product_Image.create({
      data: { ...body },
    });
    if (!productImage) {
      return res.status(400).json({
        message: "Product Image is not inserted successfully",
      });
    }

    return res.status(201).json({
      message: "Product Image is inserted successfully",
      data: productImage,
    });
  } catch (err) {
    return res.status(500).json({
      message: `An internel server error during inserted product image : ${err.message}`,
    });
  }
}

// Get :

// Get product variety image by variety id :

async function handleGetProductImageByProductVariteyId(req, res) {
  try {
    const varietyId = parseInt(req.params.varietyId);

    const productImage = await prisma.product_Image.findMany({
      where: { varietyId: varietyId },
    });

    if (productImage.length === 0) {
      return res.status(404).json({
        message: "NO image found for this product variety",
      });
    }

    return res.status(200).json({
      message: "Product Image found successfully",
      data: productImage,
    });
  } catch (err) {
    return res.status(500).json({
      message: `An internel server error during inserted product image : ${err.message}`,
    });
  }
}

// Update :

// Update product image by image id and product id of that seller :

async function handleUpdateImageUsingImageIdOfThatSeller(req, res) {
  try {
    const sellerId = parseInt(req.params.sellerId);
    const imageId = parseInt(req.body.imageId);
    const { url, alt_text, is_primary } = req.body;
    const updateData = {};
    if (url) updateData.url = url;
    if (alt_text) updateData.alt_text = alt_text;
    if (is_primary) updateData.is_primary = is_primary;

    const seller = await prisma.product_Image.findFirst({
      where: { id: imageId, variety: { product: { user_id: sellerId } } },
    });

    if (!seller)
      return res
        .status(403)
        .json({ message: "This product is not linked with you !" });

    const product = await prisma.product_Image.update({
      where: { id: imageId },
      data: updateData,
    });

    if (!product) {
      return res.status(400).json({
        message: "Failed to update data",
      });
    }

    return res.status(200).json({
      message: "Successfully Updated Image",
      product: product,
    });
  } catch (err) {
    return res.status(500).json({
      Message: `An error occured durting get update  product  Image : ${err.message}`,
    });
  } finally {
    await prisma.$disconnect();
  }
}

// Update product Image by the Admin :

async function handleUpdateImageUsingImageIdByAdmin(req, res) {
  try {
    const imageId = parseInt(req.body.imageId);
    const { url, alt_text, is_primary } = req.body;
    const updateData = {};
    if (url) updateData.url = url;
    if (alt_text) updateData.alt_text = alt_text;
    if (is_primary) updateData.is_primary = is_primary;

    const product = await prisma.product_Image.update({
      where: { id: imageId },
      data: updateData,
    });

    if (!product) {
      return res.status(400).json({
        message: "Failed to update data",
      });
    }

    return res.status(200).json({
      message: "Successfully Updated Image",
      product: product,
    });
  } catch (err) {
    return res.status(500).json({
      Message: `An error occured durting get update  product  Image : ${err.message}`,
    });
  }
}

// Delete

// Delete product image by image id and seller id of that seller :

async function handleDeleteVarietyImageBySellerIdOfThatSeller(req, res) {
  try {
    const sellerId = parseInt(req.params.sellerId);
    const imageId = parseInt(req.body.imageId);

    const variety = await prisma.product_Image.findFirst({
      where: { id: imageId, variety: { product: { user_id: sellerId } } },
    });

    if (!variety)
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });

    const product = await prisma.product_Image.deleteMany({
      where: {
        id: imageId,
      },
    });

    if (!product) {
      return res.status(400).json({
        message: "Failed to delete data",
      });
    }

    return res.status(200).json({
      message: "Successfully deleted Product Image",
      product: product,
    });
  } catch (err) {
    return res.status(500).json({
      Message: `An error occured durting get delete  product varitey image : ${err.message}`,
    });
  }
}

// Delete product image by image id by the Admin :

async function handleDeleteVarietyImageByVarietyImageIdByAdmin(req, res) {
  try {
    const imageId = parseInt(req.body.imageId);

    const product = await prisma.product_Image.deleteMany({
      where: {
        id: imageId,
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
      Message: `An error occured durting get deleted  product varitey image : ${err.message}`,
    });
  }
}

export {
  handleInsertImage as InsertImageFunction,
  handleGetProductImageByProductVariteyId as GetImageByVarietyIdFunction,
  handleUpdateImageUsingImageIdOfThatSeller as UpdateImageByTheSellerFunction,
  handleUpdateImageUsingImageIdByAdmin as UpdateImageByAdminFunction,
  handleDeleteVarietyImageBySellerIdOfThatSeller as DeleteImageByTheSellerFunction,
  handleDeleteVarietyImageByVarietyImageIdByAdmin as DeleteImageByAdminFunction,
};
