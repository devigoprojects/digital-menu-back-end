const collectionModel = require("../models/collection_model");
const menuModel = require("../models/menu_model");



// add new menu
module.exports.newMenu = async(req,res)=>{
    try {
        const data = req.body;
        const menuExists = await menuModel.findOne({name:data.name});
        if(menuExists){
            return res.json({status:'fail',message:'menu already exists'});
        };
        const collection = await collectionModel.findById(data.collectionId);
        if(!collection){
            return res.json({status:'fail',message:'collection does not exits'});
        }
        const newMenu = await menuModel(data).save();
        collection.items.push(newMenu._id);
         await collection.save();
        return res.json({status:'success',message:'added successfully'});
    } catch (error) {
        return res.json({status:'fail',message:error});
    }
}

// get all menu
module.exports.getAll = async(req,res)=>{
    try {
        const data = await menuModel.find();
        res.json({status:'success',data});
    } catch (error) {
        res.json({status:'fail',message:error});
    }
}

// update menu
module.exports.updateMenu = async(req,res)=>{
    try {
        const id = req.params.id;
        const newData = req.body;
        const menuExits = await menuModel.findById(id);
        if(!menuExits){
           return res.json({status:'fail',message:'menu does not exists'});
        }
        const newMenu = await menuModel.findByIdAndUpdate(id,newData);
        return res.json({status:'success',data:newMenu});
    } catch (error) {
        return res.json({status:'fail',message:error});
    }
}

// delete menu 
module.exports.deleteMenu = async(req,res)=>{
    try {
        const id = req.params.id;
        const menuExits = await menuModel.findById(id);
        const collection = await collectionModel.find
        if(!menuExits){
            return res.json({status:'fail',message:'menu does not exists'});
        }
        await menuModel.findByIdAndDelete(id);
        return res.json({status:'success',message:'deleted successfully'});
    } catch (error) {
        return res.json({status:'fail',message:error});
    }
}