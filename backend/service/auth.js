import jwt from 'jsonwebtoken';

function generateToken(user){
    return jwt.sign({
        id: user.id,       
        name: user.name,
        email: user.email,
        role: user.role
    }, process.env.JWT_SECREAT_KEY, { expiresIn: "7d" })
};

function getTokenFromHeader(token){
  try{
    return jwt.verify(token, process.env.JWT_SECREAT_KEY)
  } catch(err){
    console.log("An error occured while verifying token", err);
    return null;
  }
}

export {
    generateToken,
    getTokenFromHeader as getUser
}