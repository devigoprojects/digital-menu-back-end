const {Schema,model} = require('mongoose');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

const userSchema = new Schema({
    fullName:{type:String,default:""},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    phoneNumber:{type:String,default:""},
    address:{type:String,default:""},
    profileProgress:{type:Number,default:0},
    role:{type:String,enum:['customer','admin','staff'],default:'customer'},
},
{
    versionKey:false
}
);

// hash password before saving

userSchema.pre('save',async function(next){
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedpassword =await bcrypt.hash(this.password,salt);
        this.password = hashedpassword;
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.pre(['update','findOneAndUpdate','updateOne','findByIdAndUpdate'],function(next){
    const update = this.getUpdate();
    delete update._id;
    next();
});

module.exports.UserModel = model('User',userSchema);
