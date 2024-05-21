const mongoose = require("mongoose");


const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        trim: true,
    },
    slug: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
    },
    description:{
        type: String,
        require:true,
    },
    price: {
        type: Number,
        require: true,
    },
    category:{
        type: String,
        enum:["electronics", "waerables"]
        // type: mongoose.Schema.Types.ObjectId,
        // ref: "ProductCategory",
    },
    quantity:{
        type: Number,
        required: true
    },
    brand:{
        // type: mongoose.Schema.Types.ObjectId,
        // ref: "Brand",
        type: String,
    },
    sold:{
        type: Number,
        default: 0,
        select: false,
    },
    images:{
        type: Array,
    },
    color: {
        type: String,
        enum: ["Black", "Brown", "Red"],
    },
    ratings: [{
        star: Number,
        comment: String,
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            
        },
    }],
    totalRatings:{
        type: String,
        default: 0,
    },
},{timestamps:true});

module.exports = mongoose.model("Product", ProductSchema);