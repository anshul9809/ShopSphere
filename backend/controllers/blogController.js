const expressAsyncHandler = require("express-async-handler");
const Blog = require("../models/Blog");
const BlogCategory = require("../models/BlogCategory");
const User = require("../models/User");
const {validateMongodbId} = require("../utils/validateMongoDBid");



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

const deleteBlog = expressAsyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const deletedBlog = await Blog.findByIdAndDelete(id);
        res.json(deletedBlog);
    }catch(err){
        throw new Error(err?err.message:"Something went wrong");
    }
});

const getAllBlogs = expressAsyncHandler(async (req,res)=>{
    try{
        const allBlogs = await Blog.find({});
        res.json(allBlogs);
    }catch(err){
        throw new Error(err?err.message:"Something went wrong");
    }
});

const liketheBlog = expressAsyncHandler(async (req,res)=>{
    const {id} = req.body;
    validateMongodbId(id);
    try{
        const blog = await Blog.findById(id);
        const loginUser = req.body?._id;
        const isLiked = blog?.isLiked;
        const alreadyDisliked = blog?.dislikes?.find(
            (userId)=> userId?.toString() === loginUser?.toString()
        );
        if(alreadyDisliked){
            const updatedBlog = await Blog.findByIdAndUpdate(id,
                {
                    $pull: { dislikes: loginUser },
                    isDisliked: false,
                },
                {new:true}
            );
            res.json(updatedBlog);
        }
        if(isLiked){
            const updatedBlog = await Blog.findByIdAndUpdate(id,
                {
                    $pull: { likes: loginUser },
                    isLiked: false,
                },
                {new:true}
            );
            res.json(updatedBlog);
        }
        else{
            const updatedBlog = await Blog.findByIdAndUpdate(id,
                {
                    $push: { likes: loginUser },
                    isLiked: true,
                },
                { new: true }
            );
            res.json(updatedBlog);
        }
    }catch(err){
        throw new Error(err?err.message:"Something went wrong");
    }
});


const disliketheBlog = expressAsyncHandler(async (req,res)=>{
    const {id} = req.body;
    validateMongodbId(id);
    try{
        const blog = await Blog.findById(id);
        const loginUser = req.body?._id;
        const isDisiked = blog?.isDisliked;
        const alreadyLiked = blog?.likes?.find(
            (userId)=> userId?.toString() === loginUser?.toString()
        );
        if(alreadyLiked){
            const updatedBlog = await Blog.findByIdAndUpdate(id,
                {
                    $pull: { likes: loginUser },
                    isLiked: false,
                },
                {new:true}
            );
            res.json(updatedBlog);
        }
        if(isLiked){
            const updatedBlog = await Blog.findByIdAndUpdate(id,
                {
                    $pull: { dislikes: loginUser },
                    isDisliked: false,
                },
                {new:true}
            );
            res.json(updatedBlog);
        }
        else{
            const updatedBlog = await Blog.findByIdAndUpdate(id,
                {
                    $push: { dislikes: loginUser },
                    isDisliked: true,
                },
                { new: true }
            );
            res.json(updatedBlog);
        }
    }catch(err){
        throw new Error(err?err.message:"Something went wrong");
    }
});


// const 


module.exports = {
    createBlog,
    updateBlog,
    getBlog,
    deleteBlog,
    getAllBlogs,
    liketheBlog,
    disliketheBlog
}