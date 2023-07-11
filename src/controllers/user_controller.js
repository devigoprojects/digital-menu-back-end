const { UserModel } = require("../models/user_model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../middlewares/email_service');
const crypto = require('crypto');
const { rmSync } = require("fs");

// create new user
// access public
 module.exports.createAccount = async(req,res)=>{
    try {
        
         const userData = req.body;
         const userExist = await UserModel.findOne({email:userData.email});
        if (userExist) {
          return  res.status(401).json({status:'fail',message:'email already exists'});
        }
         const newUser = new UserModel(userData);
         await  newUser.save();
         const accessToken = jwt.sign({
           data:newUser
          },
          process.env.ACCESS_TOKEN_SECRET,
        {noTimestamp: true,}
          );
          return res.json({status:'success',accessToken})
    } catch (error) {
        return res.status(500).json({status:'fail',message:error})
    }
 }


// user login
// access public
module.exports.login = async(req,res) =>{
    try {
        const {email,password} = req.body;
        const foundUser = await UserModel.findOne({email:email});
        if(!foundUser){
            return res.status(401).json({status:'fail',message:'user not found'});
        }
      const passwordMatch =  await bcrypt.compare(password,foundUser.password);
      if(!passwordMatch){
        return res.status(401).json({status:'fail',message:'Incorrect password'});
      }
      const accessToken = jwt.sign({
        data:foundUser
      },
      process.env.ACCESS_TOKEN_SECRET,
    {noTimestamp: true,}
      );
      return res.json({status:'success',accessToken})
    } catch (error) {
      return  res.status(500).json({status:'fail',message:error})
    }
}

// current user info
// access private

module.exports.currentUser = async(req,res)=>{
    try {
        const data = req.data;
        return res.json({status:'success',data});
    } catch (error) {
        return  res.status(500).json({status:'fail',message:error})
    }
}

// Delete Account
// access private
module.exports.deleteAccount = async(req,res)=>{
 
    try {
       const data = req.data.data;
       const id = req.params.id;
       const userExist = await UserModel.findById(id);
       if(userExist){
        if(data._id === id && data.role === 'admin'){
            return res.status(403).json({status:'fail',message:"can't delete default admin"});
        }
        else if(data._id === id || data.role === 'admin'){
            const deleteUser = await UserModel.findByIdAndDelete(id);
            return res.json({status:'success',message:"account deleted successfully"});
        }else{
            return res.status(403).json({status:'fail',message:"Forbidden"});
        }
       
       }
       return res.status(404).json({status:"fail",message:'user not found'});
    } catch (error) {
        return res.status(401).json({status:'fail',message:error})
    }
}


// update profile
// access private

module.exports.update = async(req,res)=>{
    try {
        const id = req.params.id;
        const updatedData = req.body;   
       
          const user = await UserModel.findByIdAndUpdate(id, updatedData, {
            new: true
          });
          if (!user) {
            return res.status(404).json({ status:'fail',message: 'user not found' });
          }
          const accessToken = jwt.sign({
            data:user
          },
          process.env.ACCESS_TOKEN_SECRET,
        {noTimestamp: true,}
          );
          return res.json({status:'success',accessToken})
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:'fail',message:error});
    }
}


// get all users
// access only admin

module.exports.allUsers = async(req,res)=>{
     try {
        const data = req.data;
        const userRole = data.data.role;
        if(userRole === 'admin'){
            const users = await UserModel.find();
            return res.json({status:'success',data:users});
        }
        return res.status(403).json({status:'fail',message:'Forbidden'})
        
     } catch (error) {
        return res.status(500).json({status:'fail',message:error});
     }

}


// forgot password


module.exports.forgotPassword = async (req, res, next) => {
  if(req.method === 'GET'){
    res.render('forgot-password')
  }
  else if(req.method=='POST'){
    try {
      const { email } = req.body;
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(404).json({status:'fail', message: 'User not found' });
      }
      
      const secret_key = process.env.ACCESS_TOKEN_SECRET + user._id;
      const data ={
        data:user
      };
      const accessToken = jwt.sign(
         data,
        secret_key,
        {expiresIn:'2m'}
      );
      const link = `http://localhost:5000/api/user/reset-password/${user._id}/${accessToken}`;
     
      res.json({status:'success',link});
      // const token = crypto.randomBytes(20).toString('hex');
      // res.json({token,email})
      // user.resetPasswordToken = token;
      // user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
  
  
      // Attach the necessary data to the request object
      // req.emailData = {
      //   email: user._email,
      //   resetToken: link,
      // };
    
      // next();
    } catch (error) {
      res.status(500).json({ error: 'Failed to process the request' });
    }

  }

}, sendEmail, (req, res) => {
  res.json({ message: 'Password reset instructions sent to your email' });
};



// reset password
// access private
module.exports.resetPassword = async(req,res)=>{
 if(req.method === "GET"){
  try {
    const {id,token} = req.params;
    const userExist = await UserModel.findById(id);
    if(!userExist){
       return res.status(404).jso({status:'fail',message:'user not found'});
    }
    const secret = process.env.ACCESS_TOKEN_SECRET+userExist._id;
    console.log(secret)
    const data = jwt.verify(token,secret);
    res.render('reset-password',{email:userExist.email});
  } catch (error) {
    res.json({status:'fail',message:error})
  }
 }else if(req.method === 'POST'){
  try {
    const {id,token} = req.params;
    const {password} = req.body;
    console.log(password)
    const salt = await bcrypt.genSalt(10);
    const hashedpassword =await bcrypt.hash(password,salt);
    console.log(hashedpassword)
    const updatePassword = await UserModel.findByIdAndUpdate(id,{password:hashedpassword},{new:true});
    
    return res.json({status:'sucess',data:updatePassword})
  } catch (error) {
    return res.json({status:'fail',message:error})
  }
    
 }
}