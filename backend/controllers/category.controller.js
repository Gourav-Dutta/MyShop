import { prisma } from "../utils/prisma.js";
import { z } from "zod";

// main-category functions:

//main-category schema
const main_categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
});

// Create new category :
async function handleCreateNewCategory(req, res) {
  try {
    const body = main_categorySchema.parse(req.body);

    const newCategory = await prisma.Main_Categories.create({
      data: { ...body },
      include: { sub_categories: true },
    });

    if (!newCategory) {
      return res.status(400).json({
        message: "Failed to insert new Category",
      });
    }

    return res.status(201).json({
      message: "Successfully insert new Category",
      data: newCategory,
    });
  } catch (err) {
    return res.status(500).json({
      message: `An error occured during new category insertation : ${err.message}`,
    });
  } finally {
    await prisma.$disconnect();
  }
}

// Get all Category
async function handlegetAllCategoryItem(req, res) {
  try {
    const AllCategories = await prisma.Main_Categories.findMany({
      include: { sub_categories: true },
    });

    if (!AllCategories) {
      return res.status(400).json({
        message: "Failed to get Data",
      });
    }

    return res.status(201).json({
      message: "Successfully get Data",
      data: AllCategories,
    });
  } catch (err) {
    return res.status(500).json({
      message: `An error occured during get all Category data : ${err.message}`,
    });
  } finally {
    await prisma.$disconnect();
  }
}

// Get one Category details based on Category ID
async function handlegetOneCategoryItem(req, res) {
  try {
    const categoryId = req.params.categoryId;
    const oneCategory = await prisma.Main_Categories.findUnique({
      where: { id: categoryId },
      include: { sub_categories: { include: { products: true } } },
    });

    if (!oneCategory) {
      return res.status(400).json({
        message: "Failed to get Data",
      });
    }

    return res.status(201).json({
      message: "Successfully get Data of Main Categoriy",
      data: oneCategory,
    });
  } catch (err) {
    return res.status(500).json({
      message: `An error occured during get one category : ${err.message}`,
    });
  } finally {
    await prisma.$disconnect();
  }
}

// Update Category Item based on Category ID
async function handleUpdateOneCategoryItem(req, res) {
  try {
    const categoryId = req.params.categoryId;
    const { name } = req.body;

    const updateData = {};
    if (name) updateData.name = name;

    const updatedCategory = await prisma.Main_Categories.update({
      where: { id: categoryId },
      data: { ...updateData },
      include: { sub_categories: true },
    });

    if (!updatedCategory) {
      return res.status(400).json({
        message: "Failed to update Data",
      });
    }

    return res.status(201).json({
      message: "Successfully update Data",
      data: updatedCategory,
    });
  } catch (err) {
    return res.status(500).json({
      message: `An error occured during update a category : ${err.message}`,
    });
  } finally {
    await prisma.$disconnect();
  }
}
async function handleDeleteOneCategoryItem(req, res) {
  try {
    const categoryName = req.params.categoryName;

    const validateCategory = await prisma.Main_Categories.findFirst({
      where: { name: categoryName },
      include: {
        sub_Categories: {
          include: {
            products: {
              include: {
                varirties: true,
              },
            },
          },
        },
      },
    });

    if (!validateCategory) {
      return res.status(404).json({ msg: "No category found" });
    }

    await prisma.$transaction(async (tx) => {
      const subCategoryIds = validateCategory.sub_Categories.map(s => s.id);
      const productIds = validateCategory.sub_Categories.flatMap(s =>
        s.products.map(p => p.id)
      );
      const varietyIds = validateCategory.sub_Categories.flatMap(s =>
        s.products.flatMap(p => p.varirties.map(v => v.id))
      );

      // Delete variety-related data
      if (varietyIds.length > 0) {
        await tx.product_Image.deleteMany({
          where: { varietyId: { in: varietyIds } },
        });

        await tx.Add_To_Cart.deleteMany({
          where: { productVariety_id: { in: varietyIds } },
        });

        await tx.product_Variety.deleteMany({
          where: { id: { in: varietyIds } },
        });
      }

      // Delete product-related data
      if (productIds.length > 0) {
        await tx.product_Offer.deleteMany({
          where: { productId: { in: productIds } },
        });

        await tx.product.deleteMany({
          where: { id: { in: productIds } },
        });
      }

      // Delete subcategories
      if (subCategoryIds.length > 0) {
        await tx.sub_Categories.deleteMany({
          where: { id: { in: subCategoryIds } },
        });
      }

      //  delete main category
      await tx.main_Categories.delete({
        where: { name: categoryName },
      });
    });

    return res.status(200).json({
      message: "Successfully deleted category and all related data",
      deletedCategory: categoryName,
    });

  } catch (err) {
    console.error("Delete category error:", err);
    return res.status(500).json({
      message: `An error occurred while deleting category: ${err.message}`,
    });
  }
}


// sub-category functions :

// sub-category schema

const sub_categorySchema = z.object({
  name: z.string().min(1, "Name of the Product is must needed"),
  main_categoriy_id: z.string().min(1, "Main-category is must"),
});

async function handleCreateNewSub_Category(req, res) {
  try {
    const body = sub_categorySchema.parse(req.body);

    const newSub_category = await prisma.Sub_Categories.create({
      data: { ...body },
      include: { main_category: true },
    });

    if (!newSub_category) {
      return res.status(400).json({
        message: "Failed to insert new Sub-Category",
      });
    }

    return res.status(201).json({
      message: "Successfully insert new Sub-Category",
      data: newSub_category,
    });
  } catch (err) {
    return res.status(500).json({
      message: `An error occured during new category insertation : ${err.message}`,
    });
  } finally {
    await prisma.$disconnect();
  }
}

async function handlegetAllSub_CategoryItem(req, res) {
  try {
    const AllSub_Categories = await prisma.Sub_Categories.findMany({
      include: { main_category: true },
    });

    if (!AllSub_Categories) {
      return res.status(400).json({
        message: "Failed to get Data",
      });
    }

    return res.status(201).json({
      message: "Successfully get Data",
      data: AllSub_Categories,
    });
  } catch (err) {
    return res.status(500).json({
      message: `An error occured during get All Sub-Category data : ${err.message}`,
    });
  } finally {
    await prisma.$disconnect();
  }
}

async function handlegetOneSub_CategoryItem(req, res) {
  try {
    const categoryId = req.params.categoryId;
    const oneSub_Category = await prisma.Sub_Categories.findUnique({
      where: { id: categoryId },
      include: { main_category: true },
    });

    if (!oneSub_Category) {
      return res.status(400).json({
        message: "Failed to get Data",
      });
    }

    return res.status(201).json({
      message: "Successfully get Data",
      data: oneSub_Category,
    });
  } catch (err) {
    return res.status(500).json({
      message: `An error occured during get one sub-category : ${err.message}`,
    });
  } finally {
    await prisma.$disconnect();
  }
}

async function handleUpdateOneSub_CategoryItem(req, res) {
  try {
    const categoryId = req.params.categoryId;
    const { name, main_catagoriy_id } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (main_catagoriy_id)
      updateData.main_catagoriy_id = parseInt(main_catagoriy_id);

    const updatedSub_Category = await prisma.Sub_Categories.update({
      where: { id: categoryId },
      data: { ...updateData }, // If any seller want to change the main-category
      include: { main_category: true },
    });

    if (!updatedSub_Category) {
      return res.status(400).json({
        message: "Failed to update Data",
      });
    }

    return res.status(201).json({
      message: "Successfully update Data",
      data: updatedSub_Category,
    });
  } catch (err) {
    return res.status(500).json({
      message: `An error occured during update a sub-category : ${err.message}`,
    });
  } finally {
    await prisma.$disconnect();
  }
}

async function handleDeleteOneSub_CategoryItem(req, res) {
  try {
    const categoryName = req.params.categoryName;

    const validateSub_Category = await prisma.Sub_Categories.findFirst({
      where: { name: categoryName },
      include: { products: { include : { varirties: true} },
    } } );

    if (!validateSub_Category) {
      return res.status(400).json({
        message: "No data found",
      });
    }

     await prisma.$transaction(async (tx) => {
      const subCategoryIds = validateSub_Category.id;
      const productIds = validateSub_Category.products.map(p => p.id);
      const varietyIds = validateSub_Category.products.flatMap(p =>
         p.varirties.map(v => v.id)
      );

      // Delete variety-related data
      if (varietyIds.length > 0) {

         await tx.Order_Item.deleteMany({
          where: { productVariety_id: {in : varietyIds}}
        });

         await tx.Add_To_Cart.deleteMany({
          where: { productVariety_id: { in: varietyIds } },
        });

        await tx.product_Image.deleteMany({
          where: { varietyId: { in: varietyIds } },
        });

       

        await tx.product_Variety.deleteMany({
          where: { id: { in: varietyIds } },
        });

       
      }

      // Delete product-related data
      if (productIds.length > 0) {

        
        await tx.product_Offer.deleteMany({
          where: { productId: { in: productIds } },
        });

        await tx.product.deleteMany({
          where: { id: { in: productIds } },
        });
      }

      // Delete subcategories
      
        await tx.sub_Categories.deleteMany({
          where: { id: { in: subCategoryIds } },
        });
    });
    

    return res.status(201).json({
      message: "Successfully deleted Data",
      data: validateSub_Category,
    });
  } catch (err) {
    return res.status(500).json({
      message: `An error occured during delete a sub-category : ${err.message}`,
    });
  } finally {
    await prisma.$disconnect();
  }
}
export {
  handleCreateNewCategory as newCategoryFunction,
  handlegetAllCategoryItem as getAllCategoryItem,
  handlegetOneCategoryItem as getOneCategoryItem,
  handleUpdateOneCategoryItem as updateCategoryItem,
  handleDeleteOneCategoryItem as deleteCategoryItem,
  handleCreateNewSub_Category as newSub_CategoryFunction,
  handlegetAllSub_CategoryItem as getAllSub_CategoryFunction,
  handlegetOneSub_CategoryItem as getOneSub_CategoryFunction,
  handleUpdateOneSub_CategoryItem as updateOneSub_CategoryFunction,
  handleDeleteOneSub_CategoryItem as deleteOneSub_CategoryFunction,
};
