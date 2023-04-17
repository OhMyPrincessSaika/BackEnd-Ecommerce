const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    products : [
        {
            product : {
                type : mongoose.Types.ObjectId,
                ref: "Product"
            },
            count : Number,
            color : String
        }
    ],
    orderBy : {
        type : mongoose.Types.ObjectId,
        ref : "User"
    },
    orderStatus : {
        type : String,
        default : "Not Processed",
        enum : [
            "Not Processed",
            "Processing",
            "Cash On Delivery",
            "Dispatched",
            "Cancelled",
            "Completed"
        ]
    },
    paymentIntent : {}
    
},
    {
        timestamps: true
    }

);

//Export the model
module.exports = mongoose.model('Order', orderSchema);