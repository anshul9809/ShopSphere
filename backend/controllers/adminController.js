const expressAsyncHandler = require("express-async-handler");

const User = require("../models/User");
const {generateRefreshToken} = require("../config/refreshToken");
const {generateToken} = require("../config/jwtToken");
const {validateMongodbId} = require("../utils/validateMongoDBid");

const adminLogin = expressAsyncHandler(async (req,res)=>{
    const {email, password} = req.body;
    const admin = await User.findOne({email})
    if(!admin){
        throw new Error("User not found");
    }
    if(admin.role !== "admin"){
        throw new Error("Not authorized");
    }
    if(admin && (await admin.isPasswordMatched(password))){
        const refreshToken = await generateRefreshToken(admin?._id);
        const updateUser = await User.findByIdAndUpdate(admin?._id,
            {refreshToken: refreshToken},
            {new:true});
        res.cookie("refreshToken", refreshToken,{
            httpOnly: true,
            maxAge: 24*60*60*1000*3,
        });
        res.json({
            _id: admin?._id,
            firstname: admin?.firstname,
            lastname: admin?.lastname,
            email: admin?.email,
            mobile: admin?.mobile,
            token: generateToken(admin?._id)
        });
    }
    else{
        throw new Error("Invalid Credentials");
    }
});

const allUsers = expressAsyncHandler(async (req,res)=>{
    try{
        const users = await User.find({}).select("-password");
        res.json(users);
    }catch(err){
        throw new Error(err?err.message:"Something went wrong");
    }
});

const blockUser = expressAsyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    const block = await User.findByIdAndUpdate(id, {isBlocked:true}, {new:true});
    if(block){
        res.json(block);
    }
    else{
        throw new Error("Something went wrong");
    }
});
const unblockUser = expressAsyncHandler(async (req,res)=>{
    const {id} = req.params;
    validateMongodbId(id);
    const block = await User.findByIdAndUpdate(id, {isBlocked:false}, {new:true});
    if(block){
        res.json(block);
    }
    else{
        throw new Error("Something went wrong");
    }
});


module.exports = {
    allUsers,
    adminLogin,
    blockUser,
    unblockUser
}