const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema({
   products : [
      {
         product : {
            type : mongoose.Types.ObjectId,
            ref  : "Product"
         },
         count : Number,
         color : String,
         price : Number
      }
   ],
   userCart : {
      type : mongoose.Types.ObjectId,
      ref  : "User"
   },
   totalPrice : Number,
   discountPrice : Number
},
   {timestamps : true}

);

//Export the model
module.exports = mongoose.model('Cart', cartSchema);