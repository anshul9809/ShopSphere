const expressAsyncHandler = require("express-async-handler");
const {validateMongodbId} = require("../utils/validateMongoDBId");
const slugify = require("slugify");
const {cloudinaryUploadImg} = require("../utils/cloudinary");
const fs = require("fs");

const Product = require("../models/Product");
const User = require("../models/User");

const createProduct = expressAsyncHandler(async (req,res)=>{
    try{
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
        }
        const product = await Product.create(req.body);
        res.json(product);
    }catch(err){
        throw new Error(err?err.message:"Something went wrong");
    }
});
const getProduct = expressAsyncHandler(async (req,res)=>{
    try{
        const {id} = req.params;
        validateMongodbId(id);
        const product = await Product.findById(id);
        if(!product){
            throw new Error("Product not found");
        }
        else{
            res.json(product);
        }
    }catch(err){
        throw new Error(err?err.message:"Something went wrong");
    }
});
const allProducts = expressAsyncHandler(async (req,res)=>{
    try {
        // Filtering of products
        const queryObj = { ...req.query };
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach((el) => {
            delete queryObj[el];
        });

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        let query = Product.find(JSON.parse(queryStr));

        // Sorting of products
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // Limiting the fields
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);

        if (req.query.page) {
            const productCount = await Product.countDocuments();
            if (skip >= productCount) throw new Error('This page does not exist');
        }

        const products = await query;
        res.json(products);
    } catch (err) {
        throw new Error(err?err.message:"Something went wrong");
    }
});
const updateProduct = expressAsyncHandler(async (req,res)=>{
    try{
        const {id} = req.params;
        validateMongodbId(id);
        const product = await Product.findById(id);
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
            const updateProduct = await Product.findOneAndUpdate(id, req.body, {new: true});
            res.json(updateProduct);
        }

    }catch(err){
        throw new Error(err?err.message:"Something went wrong");
    }
});
const deleteProduct = expressAsyncHandler(async (req,res)=>{
    try{
        const {id} = req.params;
        validateMongodbId(id);
        const product = await Product.findById(id);
        if(!product) throw new Error('Product not found');
        await product.remove();
        res.json({message: 'Product removed'});

    }catch(err){
        throw new Error(err?err.message:"Something went wrong");
    }
});
const rating = expressAsyncHandler(async (req, res) => {
    const {_id} = req.user;
    const {star, prodId, comment} = req.body;
    try{
        const product = await Product.findById(id);
        let alreadyRated = product.ratings.find(
            (userId) => userId.postedby.toString() === _id.toString()
        );
        if(alreadyRated){
            const updateRating = await Product.updateOne(
                {
                    ratings: { $elemMatch: alreadyRated }
                },
                {
                  $set: { "ratings.$.star": star, "ratings.$.comment": comment },
                },
                {
                  new: true,
                }
            );
        }
        else{
            const rateProduct = await Product.findByIdAndUpdate(
                prodId,
                {
                  $push: {
                    ratings: {
                      star: star,
                      comment: comment,
                      postedby: _id,
                    },
                  },
                },
                {
                  new: true,
                }
            );
        }
        const getAllRatings = await Product.findById(prodId);
        let totalRating = getallratings.ratings.length;
        let ratingsum = getallratings.ratings
        .map((item) => item.star)
        .reduce((prev, curr) => prev + curr, 0);
        let actualRating = Math.round(ratingsum / totalRating);
        let finalproduct = await Product.findByIdAndUpdate(
        prodId,
        {
            totalrating: actualRating,
        },
        { new: true }
        );
        res.json(finalproduct);
    }catch(err){
        throw new Error(err?err.message:"Something went wrong");
    }
});


const uploadImages = expressAsyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const uploader = (path)=> cloudinaryUploadImg(path, "images");
        const urls = [];
        const files = req.files;
        for(const file of files){
            console.log("file is ", file);
            const { path } = file;
            console.log("path is ", path);
            const newPath = await uploader(path);
            urls.push(newPath);
            fs.unlinkSync(path);
            
        }
        const findProduct = await Product.findByIdAndUpdate(id, {
            images: urls.map((file)=>{
                return file;
            })
        },
        {new:true});
        res.json(findProduct);
    }catch(err){
        console.log("uploading images error is ", err);
        res.status(500).json({message: "Unable to upload the images" });
    }
});

module.exports = {
    createProduct,
    getProduct,
    allProducts,
    updateProduct,
    deleteProduct,
    rating,
    uploadImages
};