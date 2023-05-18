const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
   user : {
     type : mongoose.Types.ObjectId,
     ref : 'User'
   },
   shippingInfo : {
     firstName : {
        type: String,
        required: [true,'please provide your firstname']
     },
     lastName : {
        type : String,
        required: [true,'please provide your lastname']
     },
     address : {
        type : String,
        required: [true,'please provide your address']
     },
     city : {
        type : String,
        required : [true,'please provide your city']
     },
     state : {
        type : String,
        required : [true,'please provide your state']
     },
     country : {
      type : String,
      required: [true,'please provide country']
     },
     other : {
        type: String,
        required: true
     },
     pinCode : {
        type: Number,
        required: true
     }
   },
   orderItems : [
         {
            product : {
               type: mongoose.Types.ObjectId,
               required: true,
               ref : 'Product',
            },
            color : {
               type: String,
               required: true
            },
            quantity : {
               type: Number,
               requried: true
            },
            price : {
               type: Number,
               required: true
            }
    }
   ],
   paidAt : {
    type : Date,
    default : Date.now()
   },
   month : {
      type : String,
      default : new Date().getMonth()
   },
   totalPrice : {
    type : Number,
    requried: [true]
   },
   totalPriceAfterDiscount : {
    type : Number,
    requried: [true]
   },
   orderStatus : {
    type : String,
    default : 'Ordered'
   }
},
   {
      timestamps:true
   }
);

//Export the model
module.exports = mongoose.model('Order', orderSchema);