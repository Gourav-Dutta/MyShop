import {prisma} from "../utils/prisma.js"
import { z } from "zod";


// Handle New Offer

const offerSchema = z.object({
  title: z.string().min(1, "Offer title is must necessary"),
  discount_type: z.string().min(1, "Kindly provide a discount type"),
  discount_value: z.string().min(1, "What's your discount value"),
  is_active: z.string().optional(),
});

async function handleNewDiscount(req, res) {
  try {
    const body = offerSchema.parse(req.body);
    body.discount_value =  Number (body.discount_value);

    if (typeof body.is_active === "string") {
      if (body.is_active.toLowerCase() === "true") {
        body.is_active = true;
      } else if (body.is_active.toLowerCase() === "false") {
        body.is_active = false;
      } else {
        throw new Error("Invalid Boolean value. use 'true' or  'false' . ");
      }
    }

    const newOffer = await prisma.offer.create({
      data: { ...body },
    });

    if (!newOffer) {
      return res.status(400).json({
        message: "An error occured during inserting new offer",
      });
    }

    return res.status(201).json({
      message: "New offer inserted successfullt",
      data: newOffer,
    });
  } catch (err) {
    return res.status(500).json({
      message: `An internal server error : ${err.message}`,
    });
  }
}

// Handle Get All offer
async function handleGetAllOffer(req, res) {
  try {
    const AllOffers = await prisma.offer.findMany();

    if (AllOffers.length === 0) {
      return res.status(400).json({
        message: "No offer found",
      });
    }

    return res.status(200).json({
      message: " Offers fetched successfully",
      data: AllOffers,
    });
  } catch (err) {
    return res.status(500).json({
      message: `An internal server error : ${err.message}`,
    });
  }
}

// Handle Get Offer On The Basis Of ID

async function handleGetOfferOnId(req, res) {
  try {
    const offerId = (req.params.offerId);

    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
    });

    if (!offer) {
      return res.status(400).json({
        message: "No offer found",
      });
    }

    return res.status(200).json({
      message: "Offer details fetched successfully",
      data: offer,
    });
  } catch (err) {
    return res.status(500).json({
      message: `An internal server error : ${err.message}`,
    });
  }
}

// Handle Update Offer

async function handleUpdateOffer(req, res) {
  try {
    const offerId = (req.params.offerId);
    const updateData = {};
    const { title, discount_type, discount_value, is_active } = req.body;

    if (title) updateData.title = title;
    if (discount_type) updateData.discount_type = discount_type;
    if (discount_value) updateData.discount_value = discount_value;
    if (is_active) updateData.is_active = is_active;

    if (typeof updateData.is_active === "string") {
      if (updateData.is_active.toLowerCase() === "true") {
        updateData.is_active = true;
      } else if (updateData.is_active.toLowerCase() === "false") {
        updateData.is_active = false;
      } else {
        throw new Error("Invalid Boolean value. use 'true' or  'false' . ");
      }
    }

    const updatedOffer = await prisma.offer.updateMany({
      where: { id: offerId },
      data: { ...updateData },
    });

    if (updatedOffer.count === 0) {
      return res.status(400).json({
        message: "Offer Details Not Updated",
      });
    }

    return res.status(200).json({
      message: "Offer updated successfully",
      data: updatedOffer,
    });
  } catch (err) {
    return res.status(500).json({
      message: `An internal server error : ${err.message}`,
    });
  }
}

// Handle Delete Offer

async function handleDeleteOffer(req, res) {
  try {
    const offerId = (req.params.offerId);

    const Offer = await prisma.offer.delete({
      where: { id: offerId },
    });

    if (Offer.count === 0) {
      return res.status(400).json({
        message: "Offer Details Not Deleted",
      });
    }

    return res.status(200).json({
      message: "Offer deleted successfully",
      data: Offer,
    });
  } catch (err) {
    return res.status(500).json({
      message: `An internal server error : ${err.message}`,
    });
  }
}

//Product Offer Table ::

// Insert into product offer Table

const productOfferSchema = z.object({
  productId: z.string().min(1, "Product Id is compulsory"),
  offerId: z.string().min(1, "Offer Id is compulsory"),
});

async function handleInsertProductOffer(req, res) {
  try {
    const userId = (req.user.id);
    const body = productOfferSchema.parse(req.body);
    body.productId =(body.productId);
    body.offerId =(body.offerId);

    const validateUser = await prisma.product.findFirst({
      // Validate teh seller
      where: { id: body.productId, user_id: userId },
    });

    if (!validateUser)
      return res.status(400).json({
        message:
          "You are not authorized for this action as this product is Inserted by another Seller",
      });

    const productOffer = await prisma.product_Offer.create({
      data: { ...body },
    });

    if (!productOffer) {
      return res.status(400).json({
        message: "Failed to Insert",
      });
    }
    return res.status(201).json({
      message: "Successfully inserted offer with product",
      data: productOffer,
    });
  } catch (err) {
    return res.status(500).json({
      message: `An internal server error : ${err.message}`,
    });
  }
}

// update product offer Table

async function handleUpdateProductOffer(req, res) {
  try {
    const userId = (req.user.id);
   

    const productId = (req.params.productId);
    const offerId = (req.params.offerId);

    const updateData = {};
    const { product_Id, offer_Id } = req.body;
    if (product_Id) updateData.product_Id = parseInt(product_Id);
    if (offer_Id) updateData.offer_Id = parseInt(offer_Id);

    const validateUser = await prisma.product.findFirst({
      // Validate that the same seller who insert the product try to update the offer with this product
      where: { id: productId, user_id: userId },
    });

    if (!validateUser)
      return res
        .status(400)
        .json({ message: "You are not authorized for this action" });

    const updateValue = await prisma.product_Offer.updateMany({
      where: {
        // Validate the product offer combination
        productId: productId,
        offerId: offerId,
      },
      data: {
        productId: updateData.product_Id,
        offerId: updateData.offer_Id,
      },
    });

    if (updateValue.count === 0) {
      return res.status(400).json({
        message: "Failed to modify",
      });
    }

    return res.status(200).json({
      message: "Successfully Update the Product Offer combination",
      data: updateValue,
    });
  } catch (err) {
    return res.status(500).json({
      message: `An internal server error : ${err.message}`,
    });
  }
}

// Get All Product Offer Combinations

async function handleGetAllProductOffer(req, res) {
  try {
    const allCombinations = await prisma.product_Offer.findMany();

    if (allCombinations.count === 0)
      return res.status(400).json({ message: "No combinations Exists" });

    return res.status(200).json({
      message: "Successfully fetched all product offer combinations",
      data: allCombinations,
    });
  } catch (err) {
    return res.status(500).json({
      message: `An internal server error : ${err.message}`,
    });
  }
}

// Get one specific product offer combinations

async function handleGetOneProductOffer(req, res) {
  try {
    const productId = (req.params.productId);
    const offerId = (req.params.offerId);

    const Data = await prisma.product_Offer.findFirst({
      where: {
        // Validate the product offer combination
        productId: productId,
        offerId: offerId,
      },
    });

    if (!Data) {
      return res.status(400).json({
        message: "Failed to get teh data",
      });
    }

    return res.status(200).json({
      message: "Successfully get the Product Offer combination",
      data: Data,
    });
  } catch (err) {
    return res.status(500).json({
      message: `An internal server error : ${err.message}`,
    });
  }
}

// Delete Product Offer combinations

async function handleDeleteProductOffer(req, res) {
  try {
    const userId = (req.user.id);
    

    const productId = parseInt(req.params.productId);
    const offerId = parseInt(req.params.offerId);

    const validateUser = await prisma.product.findFirst({
      // Validate that the same seller who insert the product try to update the offer with this product
      where: { id: productId, user_id: userId },
    });

    if (!validateUser)
      return res
        .status(400)
        .json({
          message:
            "You are not authorized for this action as this product in inserted by another seller not you ! ",
        });

    const deletedValue = await prisma.product_Offer.deleteMany({
      where: {
        // Validate the product offer combination
        productId: productId,
        offerId: offerId,
      },
    });

    if (deletedValue.count === 0) {
      return res.status(400).json({
        message: "Failed to modify",
      });
    }

    return res.status(200).json({
      message: "Successfully Update the Product Offer combination",
      data: deletedValue,
    });
  } catch (err) {
    return res.status(500).json({
      message: `An internal server error : ${err.message}`,
    });
  }
}

export {
  handleNewDiscount as InsertNewOffer,
  handleDeleteOffer as DeleteOffer,
  handleGetAllOffer as GetAllOffer,
  handleUpdateOffer as UpdateOffer,
  handleGetOfferOnId as GetOfferOnOfferId,
  handleInsertProductOffer as ProductOfferTableInsertation,
  handleUpdateProductOffer as updateProductOfferCombination,
  handleDeleteProductOffer as deleteProductOfferCombo,
  handleGetAllProductOffer as getAllProductOfferCombo,
  handleGetOneProductOffer as getSpecificProductOfferCombo,
};
