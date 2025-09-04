import { getUser } from "../service/auth.js";

 function authMiddleware(req, res, next){
    try{
        const AuthorizationHeaderValue = req.headers["authorization"];

        if(!AuthorizationHeaderValue || !AuthorizationHeaderValue.startsWith("Bearer "))
        {
            return res.status(401).json({
                "error": "Unathorized",
                "message": "No token provided"
            })
        }

        const token = AuthorizationHeaderValue.split("Bearer ")[1];

        const user = getUser(token);
        if(!user) {
            return res.status(401).json({
                "error" : 'Unathorized',
                "message": "Invalid token"
            })
        }

        req.user = user;
        next();
    } catch(err){
        return res.status(500).json({
            "error": "Internal Server Error",
            "message": "Soemthing went wrone in auth middleware"
        })
    }
   
}

async function adminMiddleware(req, res, next){
    try{

        if(req.user.role !== 'ADMIN'){
            return res.status(403).json({
                "error": "Forbidden",
                "message" : "You are not authorized to access this resources"
            })
        }

        next();
    } catch(err){
        return res.status(500).json({
            "error" : "Internal server error",
            "message" : `Something went wrong in admin middleware: ${err.message}`
        })
    }

}


// async function sellerAdminMiddleware(req, res, next){
//     try{
//         if( req.user.role !==  "ADMIN"){
//              return res.status(403).json({
//                 "error": "Forbidden",
//                 "message" : "You are not authorized to access this resources"
//             })
//         }

//         next();
//     }catch(err){
//         return res.status(500).json({
//             "error" : "Internal server error",
//             "message" : `Something went wrong in sellerAdmin middleware: ${err.message}`
//         })
//     }
// }

 function sellerAdminMiddleware(roles){
    return async function (req, res, next){
        try{
            const role = req.user.role;

            if(!role){
            return res.status(403).json({
                "Message" : "User has no  Authorized access"
            })
            }

            if(!roles.includes(role)){
                return res.status(403).json({
                    "message" : "You are not authorized to get access this resources"
                })
            }
            next();
        }catch(err){
                return res.status(500).json({
                    "error" : "Internal server error",
                    "message" : `Something went wrong in sellerAdmin middleware: ${err.message}`
                })
            }
    }
   
}



export {
    authMiddleware,
    adminMiddleware,
    sellerAdminMiddleware
}