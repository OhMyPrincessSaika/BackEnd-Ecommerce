const fs =  require('fs')
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.API_KEY,
    api_secret : process.env.API_SECRET
});
const {uploadImages,deleteImages} = require('../util/cloudinary');
const {StatusCodes} = require('http-status-codes');
const { BadRequestErr } = require('../errors');
const uploadProductImages = async(req,res) => {
    try{

        const files = req.files;
        console.log(files);
        for(let file of files) {
            const {path} = file;
            console.log('path'+path);
            const uploadFile = await uploadImages(path,'images');
            if(!uploadFile) throw new BadRequestErr('failed to upload file(s)');
            fs.unlink(path,(err) => {
                console.log(err);
            })
            res.status(StatusCodes.OK).json(uploadFile);
        }
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