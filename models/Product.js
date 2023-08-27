const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var prodcutSchema = new mongoose.Schema({
    title  : {
        type : String,
        required :true
    },
    slug : {
        type : String,
        lowercase : true,
    },
    description : {
        type : String,
        require: true
    },
    color : [],
    size : {
        type : String,
    },
    quantity : {
        type : Number,
        require : true
    },
    sold : {
        type : Number,
        default : 0
    },
    
    tag : String,
    ratings : [
        {   
            star : Number,
            comment : String,
            postedBy : {
                type : mongoose.Types.ObjectId,
                ref : "User"
            }
        }
    ],
    totalRating : {
        type : String,
    },
    price : {
        type : Number,
        require: true
    },
    images : [
        {
            public_id: String,
            url:''
        }
    ],
    brand : {
        type : String,
        require: true
    },
    category : {
        type : String,
        require : true
    },
    averageRating : {
        type : Number
    },
    orderBy : {
        type : mongoose.Types.ObjectId,
        ref : "User"
    }
},
    {timestamps:true}
);

//Export the model
module.exports = mongoose.model('Product', prodcutSchema);