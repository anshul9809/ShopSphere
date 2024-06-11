const expressAsyncHandler = require("express-async-handler");
const BlogCategory = require("../models/BlogCategory");

const {validateMongodbId} = require("../utils/validateMongoDBId");

const createCategory = expressAsyncHandler(async (req,res)=>{
    try{
        const category = await BlogCategory.create(req.body);
        res.status(201).json({message:"Category Created Successfully",category});
    }
    catch(err){
        throw new Error(err?err.message:"Something went wrong")
    }
});

const updateCategory = expressAsyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const updatedCategory = await BlogCategory.findByIdAndUpdate(id,req.body,{new:true});
        res.json(updatedCategory);
    }catch(err){
        throw new Error(err?err.message:"Something went wrong")
    }
});

const deleteCategory = expressAsyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const deletedCategory = await BlogCategory.findByIdAndDelete(id);
        res.json(deletedCategory);
    }catch(err){
        throw new Error(err?err.message:"Something went wrong")
    }
});

const getCategory = expressAsyncHandler(async (req,res)=>{
    try{
        const {id} = req.params;
        validateMongodbId(id);
        const category = await BlogCategory.findById(id);
        res.json(category);
    }catch(err){
        throw new Error(err?err.message:"Something went wrong")
    }
});
const getAllCategory = expressAsyncHandler(async (req,res)=>{
    try{
        const categories = await BlogCategory.find({});
        res.json(categories);
    }
    catch(err){
        throw new Error(err?err.message:"Something went wrong")
    }
});

module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getAllCategory
};