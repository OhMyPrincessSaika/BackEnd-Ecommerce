const Banner  = require('../models/Banner');
const {StatusCodes} = require('http-status-codes')
const createBanner = async(req,res) => {
    const {asset_id,public_id,url,sale_text,price_range,name,productId} = req.body;
    const banner =await Banner.create({asset_id,public_id,url,sale_text,price_range,name,productId});
    res.status(StatusCodes.OK).json(banner);
}
const updateBanner = async(req,res) => {
    const {id} = req.params;
    console.log(id);
    const updatedBanner = await Banner.findOneAndUpdate({
        public_id : id
    },
    {
        ...req.body
    },
    {
        new : true
    }
    )
    res.status(StatusCodes.OK).json(updatedBanner);
}

const getBanner = async(req,res) => {
    const {id} = req.params;
    const banner = await Banner.findOne({
        public_id : id
    });
    res.status(StatusCodes.OK).json(banner);
}
const getAllBanners = async(req,res) => {
    const banners = await Banner.find({});
    res.status(StatusCodes.OK).json({banners,hits: banners.length});
}

const deleteBanner = async(req,res) => {
    const {id} = req.params;
    console.log(id);
    try {
        const deletedBanner = await Banner.findOneAndDelete(
        {
            public_id : id
        }
    );
    res.status(StatusCodes.OK).json(deletedBanner);
}catch(err) {
        console.log(err);
    }
   
}

module.exports = {createBanner,getBanner,updateBanner,getAllBanners,deleteBanner};