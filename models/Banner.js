const mongoose = require('mongoose');

const BannerModel = mongoose.Schema({
    url : {
        type : String,
        required : [true,"url is required"]
    },
    asset_id : {
        type : String,
        required: [true,'asset_id is required']
    },
    public_id : {
        type : String,
        required : [true,'public_id is requried']
    },
    price_range : {
        type : String,
        required : [true,'price_range is required']
    },
    sale_text : {
        type : String,
        required : [true,'sale_text is required']
    },
    productId : {
        type : mongoose.Types.ObjectId,
        ref :  "Product",
        required : [true,'product id is required']
    },
    name : {
        type : String,
        required : [true,'product name is required']
    }
})

module.exports = mongoose.model("Banner",BannerModel);