const fs =  require('fs')
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.API_KEY,
    api_secret : process.env.API_SECRET
});
// const {uploadImages,deleteImages} = require('../util/cloudinary');
const {uploadToCloudinary} =require('../util/test_cloudinary')
const {StatusCodes} = require('http-status-codes')
const uploadProductImages = async(req,res) => {
    try{

        const files = req.files;
        const uploadedImages = await Promise.all(files.map(async (file) => {
            const result = await cloudinary.uploader.upload(file.path);
            return result.secure_url;
          }));
        res.status(200).json({ images: uploadedImages });
    }catch(err) {
        console.log(err);
    }
   
}
const deleteProductImages = async( req,res) => {
    const {id} = req.params;
    const data = await deleteImages(id,"images");
    res.status(StatusCodes.OK).json("deleted")
}

module.exports = {
    uploadProductImages,deleteProductImages
}