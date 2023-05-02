const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title : {
        type :String,
        required: [true,'title is required']
    },
    category : {
        type : String,
        required: [true,'category is required']
    },
    images : [{
       url : String,
       public_id : String  
    }],
    description : {
        type : String,
        required : [true,'description is required']
    }
    
} ,
 {
    timestamps : true
 }

)

module.exports = mongoose.model('Blog',blogSchema);