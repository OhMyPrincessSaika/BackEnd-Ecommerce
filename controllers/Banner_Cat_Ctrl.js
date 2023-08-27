 const BannerCat = require('../models/BannerCategory');
 const {StatusCodes} = require('http-status-codes');
 const createCatBanner = async (req,res) => {
    const {type,name,price_range,url,public_id,asset_id} = req.body;
    const createdCatBanner = await BannerCat.create({
        name,type,price_range,url,public_id,asset_id
    });
    res.status(StatusCodes.OK).json(createdCatBanner)
 }

 const getAllCatBanners = async(req,res) => {
    const allCatBanners = await BannerCat.find({});
    res.status(StatusCodes.OK).json({allCatBanners,hits: allCatBanners.length});
 }

 const getCatBanner = async(req,res) => {
    const {id} = req.params;
    console.log(id);
    const banner = await BannerCat.findOne({
        public_id : id
    });
    res.status(StatusCodes.OK).json(banner);
 }

 const updateCatBanner= async(req,res) => {
    const {id} = req.params;
    const updatedBanner = await BannerCat.findOneAndUpdate({
         public_id : id
    },
        {
            ...req.body
        }
        ,
        {
            new : true
        }
    )
    res.status(StatusCodes.OK).json(updatedBanner);
 }

 const deleteCatBanner = async(req,res) => {
    const {id} = req.params;
    const deletedBanner = await BannerCat.findOneAndDelete({
        public_id : id
    });
    res.status(StatusCodes.OK).json(deletedBanner);
 }

 module.exports = {createCatBanner,updateCatBanner,deleteCatBanner,getAllCatBanners,getCatBanner}