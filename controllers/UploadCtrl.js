const fs =  require('fs')
const {uploadImages,deleteImages} = require('../util/cloudinary');
const {StatusCodes} = require('http-status-codes')
const uploadProductImages = async(req,res) => {
    const files = req.files;
    const urls = [];
    for(const file of files) {
        const {path} = file;
        console.log(path);
        const data= await uploadImages(path,"images");
        console.log("data :"+ data);
        fs.unlink(path,(err) => {
            if(err) {
               console.log(err);
            }
        });
        urls.push(data);
    }
    console.log("urls:"+urls);
    const images = urls.map(data => data)
    console.log(images);
    res.status(StatusCodes.OK).json(images);
 
}
const deleteProductImages = async( req,res) => {
    const {id} = req.params;
    const data = await deleteImages(id,"images");
    res.status(StatusCodes.OK).json("deleted")
}

module.exports = {
    uploadProductImages,deleteProductImages
}