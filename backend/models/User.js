const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        default:"",
        require:true,
    },
    lastName:{
        type:String,
        default: "",
        require: true
    },
    email:{
        type:String,
        require:true,
        unique:true,
    },
    mobile:{
        type:String,
        require:true,
        unique:true,
    },
    password:{
        type:String,
        require:true,
    },
    role:{
        type: String,
        default: "user",
    },
    isBlocked:{
        type: Boolean,
        default: false,
    },
    refreshToken:{
        type: String,
    },
    cart:{
        type: Array,
        default: [],
    },
    address: {type: String},
    // wishlist: [{type: mongoose.Schema.Types.ObjectId, ref: "Product"}],
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordresetExpires: Date,
},{
    timestamps: true,
});


UserSchema.pre("save", async function (next) {
    const user = this;
    // Only hash the password if it's modified
    if (!user.isModified('password')){
        return next();
    }
    try {
        // Generating a salt
        const salt = await bcrypt.genSalt(10);

        // Hashing the password with the generated salt
        const hashedPassword = await bcrypt.hash(user.password, salt);

        // Overriding the plaintext password with the hashed one
        user.password = hashedPassword;

        next();
    }catch (error) {
        return next(error);
    }
});

UserSchema.methods.isPasswordMatched = async function (enteredPassword){
    if (!this.password) {
        throw new Error("Password is not defined");
    }
    return await bcrypt.compare(enteredPassword, this.password);
}

UserSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.passwordResetExpires = Date.now() + 30*60*1000;
    return resetToken;
}


//Export the model
module.exports = mongoose.model('User', UserSchema);