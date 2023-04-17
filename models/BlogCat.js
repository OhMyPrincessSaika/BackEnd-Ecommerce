const mongoose = require('mongoose');

const blogCatSchema = new mongoose.Schema({
    
    category : {
        type : String,
        required: [true,'category is required']
    } 
})

module.exports = mongoose.model('BlogCategory',blogCatSchema);