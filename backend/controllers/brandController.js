const expressAsyncHandler = require("express-async-handler");
const {validateMongodbId} = require("../utils/validateMongoDBId");
const Brand = require("../models/Brand");

const createBrand = expressAsyncHandler(async (req,res)=>{
    try{
        const brand = await Brand.create(req.body);
        res.json(brand);
    }catch(err){
        throw new Error(err?err.message:"Something went wrong");
    }
});
const updateBrand = expressAsyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const updatedBrand = await Brand.findByIdAndUpdate(id,req.body, {new:true});
        res.json(updatedBrand)
    }catch(err){
        throw new Error(err?err.message:"Something went wrong");
    }
});
const deleteBrand = expressAsyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const deletedBrand = await Brand.findByIdAndDelete(id);
        res.json(deletedBrand);
    }catch(err){
        throw new Error(err?err.message:"Something went wrong");
    }
});
const getBrand = expressAsyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const brand = await Brand.findById(id);
        res.json(brand);
    }catch(err){
        throw new Error(err?err.message:"Something went wrong");
    }
});
const getAllBrands = expressAsyncHandler(async (req,res)=>{
    try{
        const brands = await Brand.find({});
        res.json(brands);
    }catch(err){
        throw new Error(err?err.message:"Something went wrong");
    }
});

module.exports = {
    createBrand,
    updateBrand,
    deleteBrand,
    getBrand,
    getAllBrands
}