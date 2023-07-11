const {Schema,model, default: mongoose} = require('mongoose');


const collectionSchema = new Schema({
      name:{type:String,required:true},
      
      image:{type:String,required:true},
      items:[
            {
                type:mongoose.Schema.ObjectId,
                ref:'Menu'
            }
      ]
},{
    versionKey:false
});

const collectionModel = model('Collections',collectionSchema);

module.exports = collectionModel;