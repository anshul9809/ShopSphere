const expressAsyncHandler = require("express-async-handler");
const Color = require("../models/Color");
const {validateMongodbId} = require("../utils/validateMongoDBId");

const createColor = expressAsyncHandler(async (req,res)=>{
    try{
        const newColor = await Color.create(req.body);
        res.json(newColor);
    }catch(err){
        throw new Error(err?err.message:"Something went wrong");
    }
});
const updateColor = expressAsyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const updatedColor = await Color.findByIdAndUpdate(id,req.body, {new:true});
        res.json(updatedColor);
    }catch(err){
        throw new Error(err?err.message:"Something went wrong");
    }
});
const deleteColor = expressAsyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const deletedColor = await Color.findByIdAndDelete(id);
        res.json(deletedColor);
    }catch(err){
        throw new Error(err?err.message:"Something went wrong");
    }
});
const getColor = expressAsyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const color = await Color.findById(id);
        res.json(color);
    }catch(err){
        throw new Error(err?err.message:"Something went wrong");
    }
});
const getAllColors = expressAsyncHandler(async (req,res)=>{
    try{
        const colors = await Color.find({});
        res.json(colors);
    }catch(err){
        throw new Error(err?err.message:"Soemthing went wrong");
    }
});


module.exports = {
    createColor,
    updateColor,
    deleteColor,
    getColor,
    getAllColors
};