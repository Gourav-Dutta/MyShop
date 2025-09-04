import { PrismaClient } from "@prisma/client";
import {z} from 'zod';
const prisma = new PrismaClient();




// main-category functions:

//main-category schema
const main_categorySchema = z.object({
    name : z.string().min(1, "Name is required")
});

// Create new category : 
async function handleCreateNewCategory(req, res){
    try{
            const body = main_categorySchema.parse(req.body);

            const newCategory = await prisma.main_Categories.create({
                data : { ...body},
                include : { sub_categories : true}
            })


            if(!newCategory){
                return res.status(400).json({
                    "message" : "Failed to insert new Category"
                })
            }

            return res.status(201).json({
                "message" : "Successfully insert new Category",
                "data" : newCategory
            })
    }catch(err){
        return res.status(500).json({
            "message" : `An error occured during new category insertation : ${err.message}`
        })
    }finally{
        await prisma.$disconnect();
    }
   
}

// Get all Category
async function handlegetAllCategoryItem(req, res){

    try{
        const AllCategories = await prisma.main_Categories.findMany({
            include : { sub_categories : true}
        });
            
        if(!AllCategories){
            return res.status(400).json({
                            "message" : "Failed to get Data"
                        })
                    }

            return res.status(201).json({
                        "message" : "Successfully get Data",
                        "data" : AllCategories
                    })
    }catch(err){
        return res.status(500).json({
            "message" : `An error occured during get all Category data : ${err.message}`
        })
    }finally{
        await prisma.$disconnect();
    }
} 


// Get one Category details based on Category ID
async function handlegetOneCategoryItem(req, res){

    try{
        const categoryId =  parseInt(req.params.categoryId);
        const oneCategory = await prisma.main_Categories.findUnique({
            where : { id : categoryId},
            include : { sub_categories : true}
        });
            
        if(!oneCategory){
            return res.status(400).json({
                            "message" : "Failed to get Data"
                        })
                    }

            return res.status(201).json({
                        "message" : "Successfully get Data",
                        "data" : oneCategory
                    })
    }catch(err){
        return res.status(500).json({
            "message" : `An error occured during get one category : ${err.message}`
        })
    }finally{
        await prisma.$disconnect();
    }
}


// Update Category Item based on Category ID
async function handleUpdateOneCategoryItem(req, res){

    try{
       const categoryId =  parseInt(req.params.categoryId);
       const {name} = req.body;

       const updateData = {};
       if(name) updateData.name = name; 


        
        const updatedCategory = await prisma.main_Categories.update({
            where : { id : categoryId},
            data : {...updateData},
            include : { sub_categories : true}
        });
            
        if(!updatedCategory){
            return res.status(400).json({
                            "message" : "Failed to update Data"
                        })
                    }

            return res.status(201).json({
                        "message" : "Successfully update Data",
                        "data" : updatedCategory
                    })
    }catch(err){
        return res.status(500).json({
            "message" : `An error occured during update a category : ${err.message}`
        })
    }finally{
        await prisma.$disconnect();
    }
} 


async function handleDeleteOneCategoryItem(req, res){

    try{
       const categoryId =  parseInt(req.params.categoryId);
        
        const deletedCategory = await prisma.main_Categories.delete({
            where : { id : categoryId},
            include : { sub_categories : true}
        });
            
        if(!deletedCategory){
            return res.status(400).json({
                            "message" : "Failed to delete Data"
                        })
                    }

            return res.status(201).json({
                        "message" : "Successfully deleted Data",
                        "data" : deletedCategory
                    })
    }catch(err){
        return res.status(500).json({
            "message" : `An error occured during delete a category : ${err.message}`
        })
    }finally{
        await prisma.$disconnect();
    }
} 







// sub-category functions : 


// sub-category schema 

const sub_categorySchema = z.object({
    name : z.string().min(1, "Name of the Product is must needed"),
    main_catagoriy_id : z.string().min(1, "Main-category is must")
})

async function handleCreateNewSub_Category(req, res){
    try{
        const body = sub_categorySchema.parse(req.body);

        body.main_catagoriy_id = parseInt(body.main_catagoriy_id);

        const newSub_category = await prisma.sub_Categories.create({
            data : { ...body},
            include : { main_category : true}
        })

        if(!newSub_category){
                    return res.status(400).json({
                        "message" : "Failed to insert new Sub-Category"
                    })
                }

        return res.status(201).json({
                    "message" : "Successfully insert new Sub-Category",
                    "data" : newSub_category
                })
    }catch(err){
        return res.status(500).json({
            "message" : `An error occured during new category insertation : ${err.message}`
        })
    }finally{
        await prisma.$disconnect();
    }
   
}


async function handlegetAllSub_CategoryItem(req, res){

    try{
        const AllSub_Categories = await prisma.sub_Categories.findMany({
            include : { main_category : true}
        });
            
        if(!AllSub_Categories){
            return res.status(400).json({
                            "message" : "Failed to get Data"
                        })
                    }

            return res.status(201).json({
                        "message" : "Successfully get Data",
                        "data" : AllSub_Categories
                    })
    }catch(err){
        return res.status(500).json({
            "message" : `An error occured during get All Sub-Category data : ${err.message}`
        })
    }finally{
        await prisma.$disconnect();
    }
} 


async function handlegetOneSub_CategoryItem(req, res){

    try{
        const categoryId =  parseInt(req.params.categoryId);
        const oneSub_Category = await prisma.sub_Categories.findUnique({
            where : { id : categoryId},
            include : { main_category : true}
        });
            
        if(!oneSub_Category){
            return res.status(400).json({
                            "message" : "Failed to get Data"
                        })
                    }

            return res.status(201).json({
                        "message" : "Successfully get Data",
                        "data" : oneSub_Category
                    })
    }catch(err){
        return res.status(500).json({
            "message" : `An error occured during get one sub-category : ${err.message}`
        })
    }finally{
        await prisma.$disconnect();
    }
}



async function handleUpdateOneSub_CategoryItem(req, res){

    try{
       const categoryId =  parseInt(req.params.categoryId);
       const {name, main_catagoriy_id} = req.body;

       const updateData = {};
       if(name) updateData.name = name; 
       if(main_catagoriy_id) updateData.main_catagoriy_id = parseInt(main_catagoriy_id);


        
        const updatedSub_Category = await prisma.sub_Categories.update({
            where : { id : categoryId},
            data : {...updateData},
            include : { main_category : true}
        });
            
        if(!updatedSub_Category){
            return res.status(400).json({
                            "message" : "Failed to update Data"
                        })
                    }

            return res.status(201).json({
                        "message" : "Successfully update Data",
                        "data" : updatedSub_Category
                    })
    }catch(err){
        return res.status(500).json({
            "message" : `An error occured during update a sub-category : ${err.message}`
        })
    }finally{
        await prisma.$disconnect();
    }
} 

async function handleDeleteOneSub_CategoryItem(req, res){

    try{
       const categoryId =  parseInt(req.params.categoryId);
       console.log(categoryId);
       
        
        const deletedSub_Category = await prisma.sub_Categories.delete({
            where : { id : categoryId},
            include : {main_category : true}
           
        });
            
        if(!deletedSub_Category){
            return res.status(400).json({
                            "message" : "Failed to delete Data"
                        })
                    }

            return res.status(201).json({
                        "message" : "Successfully deleted Data",
                        "data" : deletedSub_Category
                    })
    }catch(err){
        return res.status(500).json({
            "message" : `An error occured during delete a sub-category : ${err.message}`
        })
    }finally{
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
    handleDeleteOneSub_CategoryItem as deleteOneSub_CategoryFunction
}