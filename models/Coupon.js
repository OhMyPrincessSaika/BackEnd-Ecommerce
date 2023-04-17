
const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var couponSchema = new mongoose.Schema({
    name : {
        type: String,
        unique : true,
        uppercase :true,
        required : [true,"please provide coupon name"],
        index : true
    },
    expiry : {
        type : Date,
        required: true
    },
    discountPercent : {
        type :Number,
        required : true
    }
}, 
    {
        timestamps : true
    }

);

//Export the model
module.exports = mongoose.model('Coupon', couponSchema);