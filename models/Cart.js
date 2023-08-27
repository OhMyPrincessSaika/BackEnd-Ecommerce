const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema({
    productId :  {
      type : mongoose.Types.ObjectId,
      ref  : 'Product'
    },
    userId : {
      type : mongoose.Types.ObjectId,
      ref : "User"
    },
    quantity : {
      type : Number,
      required : true
    },
    price  : {
      type : Number,
      required : true
    },
    color : [],
    size : []
},
   {timestamps : true}

);

//Export the model
module.exports = mongoose.model('Cart', cartSchema);