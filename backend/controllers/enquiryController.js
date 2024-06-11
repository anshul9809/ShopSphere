const expressAsyncHandler = require("express-async-handler");
const {validateMongodbId} = require("../utils/validateMongoDBid");
const Enquiry = require("../models/Enquiry");

const createEnquiry = expressAsyncHandler(async (req,res)=>{
    try{
        const enquiry = await Enquiry.create(req.body);
        res.json(enquiry);
    }catch(err){
        throw new Error(err?err.message:"Something went wrong");
    }
});
const updateEnquiry = expressAsyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const updatedQuery = await Enquiry.findByIdAndUpdate(id,req,body, {new:true});
        res.json(updatedQuery);
    }catch(err){
        throw new Error(err?err.message:"Soemthing went wrong");
    }
});
const  deleteEnquiry = expressAsyncHandler(async (req,res)=>{
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const deletedEnquiry = await Enquiry.findByIdAndDelete(id);
        res.json(deletedEnquiry);
    } catch (error) {
        throw new Error(error);
    }
});
const getEnquiry = expressAsyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const enquiry = await Enquiry.findById(id);
        res.json(enquiry);
    }catch(err){
        throw new Error(err?err.message:"Something went wrong");
    }
});
const getAllEnquiry = expressAsyncHandler(async (req,res)=>{
    try{
        const enquiries = await Enquiry.find({});
        res.json(enquiries);
    }catch(err){
        throw new Error(err?err.message:"Something went wrong");
    }
});



module.exports = {
    createEnquiry,
    updateEnquiry,
    deleteEnquiry,
    getEnquiry,
    getAllEnquiry
}