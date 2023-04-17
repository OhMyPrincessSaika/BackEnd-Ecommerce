const { BadRequestErr } = require('../errors');

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.API_KEY,
    api_secret : process.env.API_SECRET
})

const uploadImages = async(fileToUpload,req,res) => {
    try{
        const result = await cloudinary.uploader.upload_stream(fileToUpload,{resource_type: "auto"});
        console.log(result)
        return {
            url:result.secure_url,
            asset_id:result.asset_id,
            public_id : result.public_id
        
        }
    }catch(err) {
       throw new BadRequestErr(err);
    }
}
const deleteImages = async(fileToDelete,req,res) => {
    const result = await cloudinary.uploader.destroy(fileToDelete,{resource_type:"image"})
    
    if(!result) throw new BadRequestErr('failed to delete');
    return result;
}
module.exports = {uploadImages,deleteImages};