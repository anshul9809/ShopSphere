const expressAsyncHandler = require("express-async-handler");
const Blog = require("../models/Blog");
const BlogCategory = require("../models/BlogCategory");
const User = require("../models/User");
const validateMongodbId = require("../utils/validateMongoDBId");



const createBlog = expressAsyncHandler(async (req,res)=>{
    try{
        const blog = await Blog.create(req.body);
        res.json({
            status: "success",
            blog});
    }catch(err){
        throw new Error(err?err.message:"Something went wrong");

    }
});

const updateBlog = expressAsyncHandler(async (req,res)=>{
    try{
        const {id} = req.params;
        validateMongodbId(id);
        const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {new:true});
        res.json(updatedBlog);
    }catch(err){
        throw new Error(err?err.message:"Something went wrong");
    }
});

const getBlog = expressAsyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const blog = await Blog.findById(id).populate("likes").populate("dislikes");
        await Blog.findByIdAndUpdate(id,
            {
                $inc: {numViews:1},
            },
            {new:true}
        );
        res.json(blog);
    }
    catch(err){
        throw new Error(err?err.message:"Something went wrong");
    }
});



// const 


module.exports = {
    createBlog,
    updateBlog,
    getBlog
}