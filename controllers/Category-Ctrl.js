const Category = require('../models/Category');
const {StatusCodes} = require('http-status-codes');
const {NotFoundErr,BadRequestErr, DuplicateErr} = require('../errors');
const getAllCategories = async(req,res) => {
    const categories = await Category.find({});
    if(categories.length <1) {
        throw new NotFoundErr('There is no categories');
    }
    const length = categories.length;
    return res.status(StatusCodes.OK).json({categories,hits: length})
}

const createCategory = async(req,res) => {
    const {category} = req.body;
    const isAlreadyExist =await Category.findOne({category:category});
    if(isAlreadyExist) throw new DuplicateErr('category is already exist')
    const createdCategory = await Category.create({...req.body});
    if(!createdCategory) throw new BadRequestErr('cannot create category');
    return res.status(StatusCodes.OK).json(createdCategory);
}

const getCategory = async(req,res) => {
    const {id} = req.params;
    const category = await Category.findById(id);
    if(!category) throw new NotFoundErr( `there is no category with this id ${id}`);
    return res.status(StatusCodes.OK).json(category);
}

const updateCategory = async(req,res) => {
    const {id} = req.params;
    const updatedCategory = await Category.findByIdAndUpdate(
        id,
        {...req.body},
        {new:true}
    )
    if(!updatedCategory) throw new BadRequestErr('cannot update category');
    return res.status(StatusCodes.OK).json(updatedCategory);
}

const deleteCategory = async(req,res) => {
    const {id} = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);
    if(!deletedCategory) throw new BadRequestErr('cannot delete category');
    return res.status(StatusCodes.OK).json(deletedCategory)
}

module.exports = {createCategory,getCategory,updateCategory,deleteCategory,getAllCategories}