const mongoose = require('mongoose');

const BannerCatSchema = mongoose.Schema({
    url : {
        type : String,
        required : [true, 'Url is required']
    },
    public_id : {
        type : String,
        required : [true, 'Public_id is required']
    },
    asset_id : {
        type : String,
        required : [true,'Asset_Id is required']
    },
    name : {
        type : String,
        required : [true,'Product name is required']
    },
    price_range : {
        type : String,
        required : [true,"Price Range is required"]
    },
    type : {
        type : String,
        required : [true,"Type is Required"]
    }
})

module.exports = mongoose.model("BannerCategory",BannerCatSchema);