const collectionModel = require("../models/collection_model");


// adding new collection

module.exports.NewCollection = async(req,res)=>{
     try {
         const data = req.body;
         const collectionExists = await collectionModel.findOne({name:data.name});
         if (!collectionExists) {
            const newCollection = new collectionModel(data);
            await newCollection.save();
            return res.json({status:'success',message:'new collection added'});
         }
         return res.json({status:'fail',message:'collection already exist'});
        
     } catch (error) {
        return res.status(500).json({status:'fail',message:error});
     }
}


// getting all collections
module.exports.allCollections = async(req,res)=>{
    try {
        const data = await collectionModel.find();
        return res.json({status:'success',data});
    } catch (error) {
        return res.status(500).json({status:'fail',message:error});
    }
}


// delete collection
module.exports.deleteCollection = async(req,res)=>{
    try {
        const id = req.params.id;
        const deleteById = await collectionModel.findByIdAndDelete(id);
        return res.json({status:'success',message:'collection deleted successfully'});
    } catch (error) {
        return res.json({status:'fail',message:error});
    }
}

// get single collection
module.exports.getCollection = async(req,res)=>{
    try {
        const id = req.params.id;
        const data = await collectionModel.findById(id);
        if(!data){
            return res.json({status:'fail',message:'collection not exist'});
        }
        return res.json({status:'success',data});
    } catch (error) {
        return res.json({status:'fail',message:error})
    }
}