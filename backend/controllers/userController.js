const expressAsyncHandler = require("express-async-handler");
const crypto = require("crypto");

const User = require("../models/User");
const {generateRefreshToken} = require("../config/refreshToken");
const {generateToken} = require("../config/jwtToken");
const {sendMail} = require("./mailController");
const {validateMongodbId} = require("../utils/validateMongoDBid");



const registerUser = expressAsyncHandler(async (req,res)=>{
    try{
        if(!req.body.email || !req.body.password || !req.body.firstName || !req.body.lastName){
            res.status(402).json({message:"Please fill all the required fields"});
            throw new Error("Please fill all the required fields");
        }
        //check if the email is already in use or not
        let user=await User.findOne({email: req.body.email});
        if(!user){
            //create a new user
            user=new User(req.body);
            await user.save();
            let new_user = await User.findOne({email:req.body.email}).select("-password");
            return res.status(200).json(new_user);
        }
        else{
            throw new Error("User already exists");
        }
    }catch(err){
        throw new Error(err?err.message:"Something went wrong");

    }
});

const loginUser = expressAsyncHandler(async (req,res)=>{
    try{
        if(!req.body.email || !req.body.password){
            throw new Error("Please fill all the required fields");
        }
        //check if the email is already in use or not
        let user = await User.findOne({email: req.body.email});
        if(!user){
            throw new Error("Email doesn't exist");
        }
        if(user && (await user.isPasswordMatched(req.body.password))){
            const refreshToken = await generateRefreshToken(user?._id);
            const updateUser = await User.findByIdAndUpdate(user?._id,
                {refreshToken: refreshToken},
                {new:true});
            res.cookie("refreshToken", refreshToken,{
                httpOnly: true,
                maxAge: 24*60*60*1000*3,
            });
            res.json({
                _id: user?._id,
                firstname: user?.firstname,
                lastname: user?.lastname,
                email: user?.email,
                mobile: user?.mobile,
                token: generateToken(user?._id)
            });
        }
        else{
            throw new Error("Invalid credentials");
        }
    }catch(err){
        throw new Error(err?err.message:"Something went wrong");
    }
});

const logoutUser = expressAsyncHandler(async (req,res)=>{
    const cookie = req.cookies;
    if(!cookie?.refreshToken){
        throw new Error("no refresh token");
    }
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken});
    if(!user){
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        return res.status(204).json({message:"Logout successfull"});
    }
    await User.findOneAndUpdate({refreshToken}, {
        refreshToken : "",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
    });
    return res.status(204).json({message:"Logout successfull"});
});

const forgotPasswordToken = expressAsyncHandler(async (req,res)=>{
    const email = req.body.email;
    const user = await User.findOne({email});
    if(!user){
        throw new Error("User not found");
    }
    else{
        try{
            const token = await user.createPasswordResetToken();
            await user.save();
            const resetUrl = `Hi, Please follow the following link to reset your password This link is only valid for 10 mins.  <a href="${process.env.BACKEND_URL}users/reset-password/${token}">Click here</a>. <br />
            Regards, <br/>
            ShopSphere`;
            const data = {
                to:email,
                subject: "Forgot Password Reset link",
                text:"Hey User",
                htm: resetUrl
            };
            sendMail(data);
            res.json(token);
        }catch(err){
            throw new Error(err?err.message:"Something went wrong");
        }
    }
});

const resetPassword = expressAsyncHandler(async (req,res)=>{
    const password = req.body.password;
    const token = req.params.token;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        passwordResetToken: hashedToken,
    });
    if(!user){
        throw new Error("Token expired, Please try again later");
    }
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    let new_user = await User.findOne({email:user.email}).select("-password");
    return res.status(200).json(new_user);
});

const updatePassword = expressAsyncHandler(async (req,res)=>{
    const id = req.user._id;
    const password = req.body.password;
    validateMongodbId(id);
    const user = await User.findById(id)
    if(password){
        user.password = password;
        const updatedPassword = await user.save();
        let new_user = await User.findById({_id:id}).select("-password");
        res.status(200).json(new_user);
    }
    else{
        throw new Error("Password is required");
    }
});

const handleRefreshToken = expressAsyncHandler(async (req,res)=>{
    const cookie = req.cookies;
    if(!cookie.refreshToken){
        throw new Error("No Reresh Token");
    }
    const user = await User.findOne({refreshToken});
    if(!user){
        throw new Error("No refresh token for this id");
    }
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded)=>{
        if(err || user._id !== decoded._id){
            throw new Error("there is a error in refresh Token");
        }
        const accessToken = generateToken(user?._id);
        res.json(accessToken);
    });
});



module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    forgotPasswordToken,
    resetPassword,
    updatePassword,
    handleRefreshToken,
}