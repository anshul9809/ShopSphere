const mongoose = require("mongoose");

const couponSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unqiue: true,
        uppercase: true,
    },
    expiry:{
        type: Date,
        required: true
    },
    discount: {
      type: Number,
      required: true,
    },
},{
    timestamps:true
});

module.exports = mongoose.model("Coupon", couponSchema);