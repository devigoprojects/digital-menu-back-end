const jwt = require('jsonwebtoken');

const validateToken = async(req,res,next)=>{
   let token;
   let authHeader = req.headers.Authorization || req.headers.authorization;
   if(authHeader && authHeader.startsWith('Bearer')){
    token = authHeader.split(' ')[1];
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
        if(err){
          return  res.status(401).json({status:"fail",message:"user is not authorized"});
        }
       req.data = decoded;
       next();
    })
   }else{
    return res.status(401).json({status:'fail',message:'Unauthorized'})
   }
   
}

module.exports = validateToken;