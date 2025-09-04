import { includes, z } from "zod";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const productSchema = z.object({
  name: z.string().min(1, "Name is must neede"),
  description: z.string().min(10, "A product description is must neede"),
  sub_catagory_id: z.string().min(1, "Must provide a sub category id"),
  base_image: z
    .string()
    .url("Image must be a valid URL")
    .min(1, "Image for an product is must needed"),
  brand: z.string().min(1, "Brand name is must needed"),
  status: z.enum(["Active", "Inactive"]).optional().default("Active"),
});

async function handleProductEntry(req, res) {
  try {
    const body = productSchema.parse(req.body);
    body.sub_catagory_id = parseInt(body.sub_catagory_id);
    body.brand = parseInt(body.brand);
    const userId = parseInt(req.user.id);
    console.log(body);

    const newProduct = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        base_image: body.base_image,
        sub_category: { connect: { id: body.sub_catagory_id } },
        user: { connect: { id: userId } },
        brand: { connect: { id: body.brand } },
      },
    });

    if (!newProduct) {
      return res.status(400).json({
        Message: "Failed in enter new Product",
      });
    }

    return res.status(201).json({
      message: "New Product Inserted Successfully",
      data: newProduct,
    });
  } catch (err) {
    return res.status(500).json({
      Message: `An error occured durting enter new product : ${err.message}`,
    });
  } finally {
    await prisma.$disconnect();
  }
}

//Get product by the user itself - User and Admin only
async function handleGetProductByUserItself(req, res) {
  try {
    const userId = parseInt(req.user.id);

    const products = await prisma.product.findMany({
      where: {
        user_id: userId,
      },
    });

    if (products.length === 0) {
      return res.status(400).json({
        message: "The user does't have any registered Product",
      });
    }

    return res.status(200).json({
      message: "Product found successfully",
      data: products,
    });
  } catch (err) {
    return res.status(500).json({
      Message: `An error occured durting get user product : ${err.message}`,
    });
  } finally {
    await prisma.$disconnect();
  }
}

// Get all product - Admin only
async function handleGetAllProduct(req, res) {
  try {
    const allProducts = await prisma.product.findMany({
      include: {
        sub_category: true,
      },
    });

    if (!allProducts) {
      return res.status(400).json({
        message: "Failed to get Products",
      });
    }

    return res.status(200).json({
      message: "Successfully get all products",
      data: allProducts,
    });
  } catch (err) {
    return res.status(500).json({
      Message: `An error occured durting get All  product : ${err.message}`,
    });
  } finally {
    await prisma.$disconnect();
  }
}

// Get product on the basis of the userId - Admin Only
async function handleGetProductUser_Id(req, res) {
  try {
    const userId = parseInt(req.params.UserId);

    const Products = await prisma.product.findMany({
      where: {
        user_id: userId,
      },
      include: { varirties: true },
    });

    if (Products.length === 0) {
      return res.status(400).json({
        message: "Failed to get Product",
      });
    }

    return res.status(200).json({
      message: `Successfully Get all products of user : ${req.user.name}`,
      data: Products,
    });
  } catch (err) {
    return res.status(500).json({
      Message: `An error occured durting get A user  product : ${err.message}`,
    });
  }
}

// Get all products based on Sub-Category - Admin only
async function handleGetProductsub_category_name(req, res) {
  try {
    const Sub_Category = req.params.sub_category_name;

    const Products = await prisma.product.findMany({
      where: {
        sub_category: {
          name: Sub_Category,
        },
      },
      include: { stock: true, sub_category: true },
    });

    // console.log(typeof(Products));  --> Object , even findMany always return an array , An Array is also an Object
    // if(Array.isArray(Products)){                            // Just for extra confusion
    //     console.log("Products is an array");  --> Array

    // }

    if (!Products) {
      return res.status(400).json({
        message: "Failed to get Product",
      });
    }

    return res.status(200).json({
      message: `Successfully Get all products of Sub-Category : ${Sub_Category}`,
      data: Products,
    });
  } catch (err) {
    return res.status(500).json({
      Message: `An error occured durting get A user  product : ${err.message}`,
    });
  } finally {
    await prisma.$disconnect();
  }
}

// Get all product based on main_categories :

async function handleGetProductMain_category_name(req, res) {
  try {
    const Main_Category = req.params.main_category_name;

    const Products = await prisma.product.findMany({
      where: {
        sub_category: {
          main_category: {
            name: Main_Category,
          },
        },
      },
      include: { sub_category: true },
    });

    if (Products.length === 0) {
      return res.status(400).json({
        message: "Failed to get Product From main category",
      });
    }

    return res.status(200).json({
      message: `Successfully Get all products of Sub-Category : ${Main_Category}`,
      data: Products,
    });
  } catch (err) {
    return res.status(500).json({
      Message: `An error occured durting get A user  product based on Main-Category : ${err.message}`,
    });
  } finally {
    await prisma.$disconnect();
  }
}

// Get product based on the product Id - Admin, seller
async function handleGetProductByProductId(req, res) {
  const Id = parseInt(req.params.productId);

  try {
    const product = await prisma.product.findUnique({
      where: { id: Id },
    });

    if (!product) {
      return res.status(400).json({
        message: "No product found",
      });
    }

    return res.status(200).json({
      message: "Product get sussessfully",
      data: product,
    });
  } catch (err) {
    return res.status(500).json({
      Message: `An error occured durting get update  product : ${err.message}`,
    });
  } finally {
    await prisma.$disconnect();
  }
}

// Update product based on the product-Id - Admin & Seller

async function handleUpdateProductproduct_Id(req, res) {
  try {
    console.log(req.user);

    const product_Id = parseInt(req.params.product_id);
    const user_Id = parseInt(req.user.id);

    const { name, description, sub_catagory_id, base_image, brand } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (sub_catagory_id) updateData.sub_catagory_id = parseInt(sub_catagory_id);
    if (base_image) updateData.base_image = base_image;
    if (brand) updateData.base_image = brand;

    const validateUser = await prisma.product.findFirst({
      where: { id: product_Id, user_id: user_Id },
    });
    if (!validateUser)
      return res
        .status(400)
        .json({ message: "You are not authorized for this action" });

    const product = await prisma.product.update({
      where: { id: product_Id },
      data: { ...updateData },
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
  } finally {
    await prisma.$disconnect();
  }
}

// Delete product based on product-Id -- Admin and seller

async function handleDeleteProductproduct_Id(req, res) {
  try {
    const product_Id = parseInt(req.params.product_id);
    const product = await prisma.product.delete({
      where: { id: product_Id },
    });

    if (!product) {
      return res.status(400).json({
        message: "Failed to delete data",
      });
    }

    return res.status(200).json({
      message: "Successfully delete Product",
      product: product,
    });
  } catch (err) {
    return res.status(500).json({
      Message: `An error occured durting delete  product : ${err.message}`,
    });
  } finally {
    await prisma.$disconnect();
  }
}

// Delete Product based on Sub-Category-name -->Admin
async function handleDeleteProductSub_Id(req, res) {
  try {
    const Sub_name = req.params.sub_id_name;
    console.log(Sub_name);

    const product = await prisma.product.deleteMany({
      where: {
        sub_category: {
          name: Sub_name,
        },
      },
      // include : { sub_category : true}   - > include is for findMany , this will not work with delete
    });

    if (!product) {
      return res.status(400).json({
        message: "Failed to delete data",
      });
    }

    return res.status(200).json({
      message: "Successfully delete Product",
      product: product,
    });
  } catch (err) {
    return res.status(500).json({
      Message: `An error occured durting delete  product : ${err.message}`,
    });
  } finally {
    await prisma.$disconnect();
  }
}

// Get products on the basis of Brand

async function handleGetProductByBrand(req, res) {
  try {
    const BrandId = parseInt(req.params.brandId);

    const Products = await prisma.product.findMany({
      where: {
        brand_id: BrandId,
      },
      include: { varirties: true },
    });

    if (Products.length === 0) {
      return res.status(400).json({
        message: "Failed to get Product",
      });
    }

    return res.status(200).json({
      message: `Successfully Get all products of user`,
      data: Products,
    });
  } catch (err) {
    return res.status(500).json({
      Message: `An error occured durting get A user  product : ${err.message}`,
    });
  }
}

export {
  handleProductEntry as newProductEntryFunction,
  handleGetProductByUserItself as getProductByTheLoginSeller,
  handleGetAllProduct as getAllProductFunction,
  handleGetProductUser_Id as getProductByUserId,
  handleGetProductsub_category_name as getProductBySub_Category,
  handleGetProductMain_category_name as getProductByMain_Category,
  handleDeleteProductproduct_Id as deleteProductByProduct_Id,
  handleDeleteProductSub_Id as deleteProductBySub_name,
  handleUpdateProductproduct_Id as updateProductByProduct_Id,
  handleGetProductByProductId as getProductByProductId,
  handleGetProductByBrand as getProductByBrandId,
};
