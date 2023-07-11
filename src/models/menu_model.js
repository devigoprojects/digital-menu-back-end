const {Schema,model} = require('mongoose');
const menuSchema  = new Schema({
        collectionId:{type:Schema.Types.ObjectId,ref:'Collections'},
        name:{type:String},
        price:{type:Number},
        image:{type:String}
},
{
    versionKey:false
}   
);

const menuModel = model('Menu',menuSchema);

module.exports = menuModel;