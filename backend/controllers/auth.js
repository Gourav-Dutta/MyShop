import {PrismaClient} from "@prisma/client";
import { generateToken } from "../service/auth.js";
import {z} from 'zod';
import bcrypt from 'bcrypt'
const prisma = new PrismaClient();



// Define the schema for user registration 

const userSchema = z.object({
    name : z.string().min(1, "Name is required"),
    email : z.string().email("Invalid email fromat"),
    password : z.string().min(6, "Password must be at least 6 character Long"),
    phone_no : z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number must not exceed 15 digits"),
    role_id : z.string().optional()
})

async function handleUserSignUp(req, res){
    try{
        const body = userSchema.parse(req.body);
        // console.log(body);


        // check if user already exists 
        const existingerUser= await prisma.user.findFirst({
            where : {email : body.email}
        });

        if(existingerUser){
            return res.status(400).json({
                "error"  : "Failed",
                "message": "User with this emamil already exists"
            })
        }

        // Hash the password before saving

        const hashPassword = await bcrypt.hash(body.password, 10);
        body.password = hashPassword

        // Create a new user
        const user = await prisma.user.create({
        data : {
        ...body,
        role_id: parseInt(body.role_id) || 3 // Default to customer role if not provided
        },
        include: {role : true}
        });

        if(!user){
        return res.status(400).json({
            "message" : "User not created"
        })
        }

        return res.status(201).json({
        "message": "User created successfully",
        "data" : user
        })
    } 
    catch(err){
        return res.status(400).json({
            "message": err.errors ? err.errors[0].message : `An error occured during user registration  : ${err.message}`
        });
    }
}

// async function handleSellerSignUp(req, res){

//     const body = req.body;
//     const payload = {
//         name:body.name,
//         email:body.email,
//         password:body.password,
//         phone_no:body.phone_no,
//         address:body.address,
//     }

//     const user = await prisma.user.create({
//         data : payload,
//          role: {
//           connect: { id: 2 }, 
//         },
//     })

//     if(!user){
//         return res.json({
//             "status" : "Failed",
//             "message": "User not created"
//         })
//     }


//     return res.status(201).json({
//         "status": "Success",
//         "message": "User created successfully",
//         "data": user
//     })
// }



// Define the schema for user Login
const loginSchema = z.object({
    email : z.string().email("Invalid email fromat"),
    password : z.string().min(6, "Password must be at least 6 character Long"),
})

async function handleUserLogin(req, res){
    try{
     const body  = loginSchema.parse(req.body);
    
    // check if user exists
    const userExists = await prisma.user.findFirst({
        where: {email: body.email},
        include: {role : true}
    })
    // console.log(userExists);
    
    if(!userExists) return res.status(404).json({"message": "User not found"});

    // verify password
    const isPasswordValid = await bcrypt.compare(body.password, userExists.password)

    // If password is not valid
    if(!isPasswordValid){
        return res.status(401).json({
            "message" : "Invalid email or password"
        })
    }

    const token = generateToken(userExists); 
    return res.status(200).json({
        "message": "User Logged In Successfully",
        "data": userExists,
        "token": token
    })
    } catch(err){
        console.error(err);
        return res.status(400).json({
            "message" : err.errors ? err.errors[0].message : `An  error occured during user Login : ${err.message}`
        });
    }
   
}


export {
    handleUserSignUp as SignUpFunction,
    handleUserLogin as userLoginFunction
}