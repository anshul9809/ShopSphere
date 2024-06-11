const expressAsyncHandler = require("express-async-handler");
const Coupon = require("../models/Coupon");
const {validateMongodbId} = require("../utils/validateMongoDBid");

const createCoupon = expressAsyncHandler(async (req,res)=>{
    try{
        const coupon = await Coupon.create(req.body);
        res.json(coupon);
    }catch(err){
        throw new Error(err?err.message: "Something went wrong");
    }
});
const updateCoupon = expressAsyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const updatedCoupon = await Coupon.findByIdAndUpdate(id,req.body, {new:true});
        res.json(updatedCoupon);
    }catch(err){
        throw new Error(err?err.message:"Something went wrong");
    }
});
const getCoupon = expressAsyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const coupon = await Coupon.findById(id);
        res.json(coupon);
    }catch(err){
        throw new Error(err?err.message:"Something went wrong");
    }
});
const getAllCoupon = expressAsyncHandler(async (req,res)=>{
    try{
        const allCoupons = await Coupon.find({});
        res.json(allCoupons);
    }catch(err){
        throw new Error(err?err.message:"Something went wrong");
    }
});
const deleteCoupon = expressAsyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const deletedCoupon = await Coupon.findByIdAndDelete(id);
        res.json(deletedCoupon);
    }catch(err){
        throw new Error(err?err.message:"Something went wrong");
    }

});


module.exports = {
    createCoupon, 
    updateCoupon,
    getCoupon, 
    getAllCoupon,
    deleteCoupon
}