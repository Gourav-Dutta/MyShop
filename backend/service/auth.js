import jwt from 'jsonwebtoken';
const secret = "GouravDev12@12$";



function generateToken(user){
    return jwt.sign({
        id: user.id,       
        name: user.name,
        email: user.email,
        role: user.role
    }, secret)
};

function getTokenFromHeader(token){
  try{
    return jwt.verify(token, secret)
  } catch(err){
    console.log("An error occured while verifying token", err);
    return null;
  }
}

export {
    generateToken,
    getTokenFromHeader as getUser
}