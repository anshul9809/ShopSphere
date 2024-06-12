const expressAsyncHandler = require("express-async-handler");
const crypto = require("crypto");

const User = require("../models/User");
const Cart = require("../models/Cart");
const Coupon = require("../models/Coupon");
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

const getSingleUser = expressAsyncHandler(async (req,res)=>{
    const id = req.user._id;
    validateMongodbId(id);
    const user = await User.findById(id).select("-password");
    if(!user){
        throw new Error("No user found");
    }
    res.status(200).json(user);
});

const updateUser = expressAsyncHandler(async (req,res)=>{
    const id = req.user._id;
    validateMongodbId(id);
    const user = await User.findByIdAndUpdate(id,{
        firstName: req?.body?.firstName,
        lastName: req?.body?.lastName,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
    },{new:true});
    if(!user){
        throw new Error("No user found");
    }
    else{
        res.status(200).json(user);
    }
});

const deleteUser = expressAsyncHandler(async (req,res)=>{
    const id = req.user._id;
    validateMongodbId(id);
    const user = await User.findByIdAndDelete(id);
    if(!user){
        throw new Error("No user found");
    }
    else{
        res.status(200).json(user);
    }
});

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

const getWishlist = expressAsyncHandler(async (req,res)=>{
    const {_id} = req.user;
    validateMongodbId(id);
    try{
        const wishlist = await User.findById(_id).populate("wishlist");
        res.json(wishlist);
    }catch(err){
        throw new Error(err?err.message:"Something went wrong");
    }
});

const addToCart = expressAsyncHandler(async (req,res)=>{
    const {_id} = req.user;
    const {cart} = req.body;
    validateMongodbId(id);
    try{
        let products = [];
        const user = User.findById(_id);
        // checking if user has the product in cart already
        const alreadyExist = await Cart.findOne({ orderby: user._id });
        if(alreadyExist){
            alreadyExist.remove();
        }
        for(let i=0;i< cart.length; i++){
            let object = {};
            object.product = cart[i]._id;
            object.count = cart[i].count;
            object.color = cart[i].color;
            let getPrice = await Product.findById(cart[i]._id).select("price").exec();
            object.price = getPrice.price;
            products.push(object);
        }
        let cartTotal = 0;
        for (let i = 0; i < products.length; i++) {
            cartTotal = cartTotal + products[i].price * products[i].count;
        }
        let newCart = await new Cart({
            products,
            cartTotal,
            orderby: user?._id,
        }).save();
        res.json(newCart);
    }catch(err){
        throw new Error(err?err.message:"Something went wrong");
    }
});

const getUserCart = expressAsyncHandler(async (req,res)=>{
    const {_id} = req.user;
    validateMongodbId(id);
    try{
        const cart = await Cart.findOne({ orderby: _id }).populate("products.product");
        res.json(cart);
    }catch(err){
        throw new Error(err?err.message:"Something went wrong");
    }
});

const emptyCart = expressAsyncHandler(async (req,res)=>{
    const {_id} = req.user;
    validateMongodbId(id);
    try{
        const user = await Cart.findOne({_id});
        const cart = await Cart.findOneAndRemove({ orderby: user._id });
        res.json(cart);
    }catch(err){
        throw new Error(err?err.message:"Somethign went wrong");
    }
});
// const applyCoupon = expressAsyncHandler(async (req,res)=>{
//     const {coupon} = req.body;
//     const {_id} = req.user;
//     validateMongodbId(_id);
//     validateMongodbId(id);
//     const validCoupon = await Coupon.findOne({name:coupon});
//     if(!validCoupon){
//         throw new Error("Invalid Coupon");
//     }
//     const user = await User.findOne({_id});
//     let {cartTotal} = await User.findOne();
// });


module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    forgotPasswordToken,
    resetPassword,
    updatePassword,
    handleRefreshToken,
    updateUser,
    getSingleUser,
    deleteUser,
    allUsers,
    adminLogin,
    blockUser,
    unblockUser,
    getWishlist,
    addToCart,
    getUserCart,
    emptyCart
}