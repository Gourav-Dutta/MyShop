import {prisma} from "../utils/prisma.js"
import {z} from 'zod';





// Insert New Brand : 

const brandSchema = z.object({
    name : z.string().min(2, "Brand name should be atleast 2 charaters Long")
})

async function handleInsertNewBrand(req, res){
    try{
        const Brand = brandSchema.parse(req.body);

        const newBrand = await prisma.brand.create({
            data : { ...Brand}
        })

        if(!newBrand){
            return res.status(400).json({
                "message" : "Failed to create new Brand"
            })
        }

        return res.status(201).json({
            "message" : "Successfully created new Brand",
            "data" : newBrand
        })
    }catch(err){
        return res.status(500).json({
            "message" : `An error occured during inserted new Brand : ${err.message}`
        })
    }
}



// Get all product of a Brand 

async function handleGetAllProductOfBrand(req, res){
    try{
        const brandName = req.params.brandName;
        
        const products = await prisma.brand.findFirst({
            where : { name : brandName},
            include : {products : true}
        })

        if(products.length === 0){
            return res.status(404).json({
                "message" : ` Sorry no products found for this brand : ${brandName}`
            })
        }
        
        return res.status(201).json({
            "message" : "Successfully get data",
            "data" : products
        })

    }catch(err){
        return res.status(500).json({
            "message" : `An error occured during geting the productd : ${err.message}`
        })
    }
}


// Get all Brands : 

async function handleGetAllBrand(req, res){
    try{
    const Brands = await prisma.brand.findMany();

    if(Brands.length === 0) {
        return res.status(404).json({
            "message" : "No Brands found"
        })
    }

    return res.status(200).json({
        "message" : "Successfully get All brands",
        "data" : Brands
    })
    }catch(err){
        return res.status(500).json({
            "message" : `An error occured during geting the Brands : ${err.message}`
        })
    }
}


// Update Brand : 

async function handleUpdateBrand(req, res){

    const brandId = (req.params.brandId);
    const brandData = {};
    const {name} = req.body;
    if(name) brandData.name = name;

    try{
        const updateBrand = await prisma.brand.update({
            where : { id : brandId},
            data : { ...brandData}
        })

        if(!updateBrand){
            return res.status(400).json({
                "message" : "Failed to update the Brand"
            })
        }

        return res.status(200).json({
            "message" : "Successfully update the Brand",
            "data" : updateBrand
        })
    }catch(err){
        return res.status(500).json({
            "message" : `An error occured during update the Brand : ${err.message}`
        })
    }
}


// Delete Brand : 

async function handleDeleteBrand(req, res){

    const branbdId = (req.params.branbdId);
    try{
    const deletedBrand = await prisma.brand.delete({
        where : { id : branbdId}
    })

    
        if(!deletedBrand){
            return res.status(400).json({
                "message" : "Failed to delete the Brand"
            })
        }

        return res.status(200).json({
            "message" : "Successfully deleted the Brand",
            "data" : deletedBrand
        })

    }catch(err){
        return res.status(500).json({
            "message" : `An error occured during delete the Brand : ${err.message}`
        })
    }
}


export {
    handleInsertNewBrand as insertNewBrand,
    handleGetAllProductOfBrand as getAllProductByBrand,
    handleDeleteBrand as deleteBrand,
    handleGetAllBrand as getAllBrand,
    handleUpdateBrand as updateBrand

}