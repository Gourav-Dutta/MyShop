import { prisma } from "../utils/prisma.js";
import { z } from "zod";

// Insert :

async function handleInsertImage(req, res) {
  try {
    const varietyId = req.params.varietyId;

    //  Check for uploaded files
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "Please upload at least 1 image." });
    }

    //  Limit number of pic
    if (req.files.length > 10) {
      return res
        .status(400)
        .json({
          message: "You can upload a maximum of 10 images per request.",
        });
    }

    //  Insert into cloudinary
    const images = req.files.map((file, index) => ({
      url: file.path,
      alt_text: file.originalname || `Image-${index + 1}`,
      is_primary: index === 0, // Make first image primary
    }));

    //  Save to My Database
    const productImage = await prisma.product_Image.createMany({
      data: images.map((img) => ({
        varietyId,
        url: img.url,
        alt_text: img.alt_text,
        is_primary: img.is_primary,
      })),
    });

    return res.status(201).json({
      message: `${req.files.length} product image(s) uploaded successfully`,
      count: req.files.length,
      data: productImage,
    });
  } catch (err) {
    return res.status(500).json({
      message: `Internal server error during upload: ${err.message}`,
    });
  }
}

// Get :

// Get product variety image by variety id :

async function handleGetProductImageByProductVariteyId(req, res) {
  try {
    const varietyId = req.params.varietyId;
    
    
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
    const sellerId = req.params.sellerId;
    const imageId = req.body.imageId;
    console.log(req);
    const seller = await prisma.product_Image.findFirst({
      where: { id: imageId, variety: { product: { user_id: sellerId } } },
    });

    if (!seller)
      return res
        .status(403)
        .json({ message: "This product is not linked with you !" });

    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Please upload at least 1 image." });
    }

    const product = await prisma.product_Image.update({
      where: { id: imageId },
      data: {
        url: req.file.path,
        alt_text: req.file.originalname || "Updated Image",
      },
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

// Delete

// Delete product image by image id and seller id of that seller :

async function handleDeleteVarietyImageBySellerIdOfThatSeller(req, res) {
  try {
    const sellerId = req.params.sellerId;
    const imageId = req.body.imageId;

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
    const imageId = req.body.imageId;

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
  handleDeleteVarietyImageBySellerIdOfThatSeller as DeleteImageByTheSellerFunction,
  handleDeleteVarietyImageByVarietyImageIdByAdmin as DeleteImageByAdminFunction,
};
