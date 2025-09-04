import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';


const prisma = new PrismaClient();



// Get one user using userId  -- All can have access
async function handleGetOneUser(req, res){
    try{
        const userId = parseInt(req.params.id);

        const user = await prisma.user.findUnique({
            where: { id : userId},
            include: { role: true },
        })
        if(!user) res.status(404).json({"message": "User not found", "status": "Failed"});
        return res.status(200).json({
            "Message": "User fetched Succesfully",
            "data": user
        })
    }catch(err){
        return res.status(500).json({
            "message" : `An error occured while fetching one user: ${err.message}`
        })
    }
    finally{
        await prisma.$disconnect();
    }
}


// Get all user -- Admin 
async function handleGetAllUsers(req, res){
    try{
        const users = await prisma.user.findMany({
            include: {role : true}
        })

        if(!users){
            return res.status(404).json({
                "message" : "No users found"
            })
        }

        return res.status(200).json({
            "message" : "Users fetched successfully",
            "data": users
        })
    }catch(err){
        return res.status(500).json({
            "message" : `An error occured while fetching all user: ${err.message}`,
        })
    }
    finally{
        await prisma.$disconnect();
    }

}


// Update user details
async function handleUpdateUser(req, res){
    try{

        const userId = parseInt(req.params.id);
        const {name, email, phone_no, address, password} = req.body;
        
        // Build my updateData Dynamically
        const updateData = {};

        if(name) updateData.name = name;
        if(email) updateData.email = email;
        if(phone_no) updateData.phone_no = phone_no;
        if(address) updateData.address = address;

        if(password){
            updateData.password = await bcrypt.hash(password, 10);
        }


        const user = await prisma.user.update({
            where: {id : userId},
            data : updateData,
            include : {role : true}
        })

        if(!user){
            return res.status(400).json({
                "message" : "Failed to update User"
            })
        }


        return res.status(200).json({
            "message" : "User updated successful",
            "data" : user
        })
    }catch(err){
        return res.status(500).json({
            "message" : `An error occured while updating user: ${err.message}`
        })
    }
    finally{
        await prisma.$disconnect();
    }
}


// Delete user - Admin
async function handleDeleteOneUser(req, res){
    try{
        const userId = parseInt(req.params.id);

        // Find and delete the user 

        const user = await prisma.user.delete({
            where : {id : userId},
            include : {role : true}
        })

        if(!user){
            return res.status(400).json({
                "message" : "Failed to Delete User"
            })
        }


        return res.status(200).json({
            "message" : "User Deleted successful",
            "data" : user
        })
    }catch(err){
        return res.status(500).json({
            "message" : `An error occured while updating user: ${err.message}`
        })
    }
    finally{
        await prisma.$disconnect();
    }
   
}



// Get all user based on user-role 
async function handleGetAllUserUsingRole(req, res){
    try {

        const userRole = req.params.role;

        const user = await prisma.user.findMany({
        where : {
            role : {
                role : userRole
            }
        }
        })

        if(user.length === 0 ){
        return res.status(400).json({
                    "message" : "Failed to get User"
                })  
        }

        return res.status(200).json({
            "message" : "User successfully get from user table ",
            "data" : user
        })
    }catch(err){
        return res.status(500).json({
            "message" : `An error occured while Geting user: ${err.message}`
        })
    }
    finally{
        await prisma.$disconnect();
    }
   
}


// Get the user role based on the user-id
async function handleGetUser_roleFromUserId(req, res){

    try{

        const userId = parseInt(req.params.id);
        // console.log(userId);
        

        const user = await prisma.user_role.findMany({
            where : {
                users : {
                    // some : {name : "Gourav Dutta" }
                    some : {id : userId}
                }
            },
            // include : {users : true}
        });
        if(!user){
        return res.status(400).json({
                    "message" : "Failed to get User"
                })  
        }

        return res.status(200).json({
            "message" : "User Role successfully get",
            "data" : user
        })

    }catch(err){
        return res.status(500).json({
            "message" : `An error occured while Geting user: ${err.message}`
        })
    }
    finally{
        await prisma.$disconnect();
    }
   
}




export { 
       handleGetOneUser as getOneUserFunction,
       handleGetAllUsers as getAllUsers,
       handleUpdateUser as updateUser,
       handleDeleteOneUser as deleteUser,
       handleGetAllUserUsingRole as getUserUsingRole,
       handleGetUser_roleFromUserId as getUser_RoleFromUserId
       }