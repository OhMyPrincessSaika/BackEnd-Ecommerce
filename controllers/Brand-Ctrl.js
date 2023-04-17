const Brand = require('../models/Brand');
const {StatusCodes} = require('http-status-codes');
const {BadRequestErr,DuplicateErr, NotFoundErr} = require('../errors');
const getAllBrands =  async(req,res) => {
    const brands = await Brand.find({});
    if(brands.length < 1) {
        res.status(StatusCodes.NOT_FOUND).send('There is no brands');
    }
    const length = brands.length;
    return res.status(StatusCodes.OK).json({brands,hits:length});
}
const createBrand = async(req,res) => {
    const {brand} = req.body;
    const isBrandAlreadyExisted = await Brand.findOne({brand});
    if(isBrandAlreadyExisted) {
        throw new DuplicateErr('The brand is already exist.')
    }
    const createdBrand = await Brand.create({brand});
    if(!createdBrand) throw new BadRequestErr('cannot create brand');
    return res.status(StatusCodes.OK).json({createdBrand});
}

const getBrand = async(req,res) => {
    const {id} = req.params;
    const brand = await Brand.findById(id);
    if(!brand)  throw new NotFoundErr(`There is no brand with id ${id}`)
    return res.status(StatusCodes.OK).json({brand});
}
const updateBrand = async(req,res) => {
    const {id} = req.params;
    const {brand} = req.body;
    
    const updatedBrand = await Brand.findByIdAndUpdate(
        id,
        {brand},
        {new: true}
    )
    if(!updatedBrand) throw new BadRequestErr('cannot update the brand');
    return res.status(StatusCodes.OK).json(updatedBrand);
}
const deleteBrand = async(req,res) => {
    const {id} = req.params;
    const deletedBrand = await Brand.findByIdAndDelete(id);
    if(!deletedBrand) throw new BadRequestErr('cannot delete the brand');
    return res.status(StatusCodes.OK).json(deletedBrand);
}

module.exports = {createBrand,updateBrand,getBrand,getAllBrands,deleteBrand}