const BlogCat = require('../models/BlogCat');
const {StatusCodes} = require('http-status-codes');
const {NotFoundErr,BadRequestErr} = require('../errors');
const createBlogCategory = async(req,res) => {
    const createdBlogCat = await BlogCat.create({...req.body});
    if(!createdBlogCat) throw new BadRequestErr('cannot create blog category.');
    res.status(StatusCodes.OK).json(createdBlogCat)
}

const getAllBlogCategories = async(req,res) => {
    const blogCat = await BlogCat.find({});
    if(blogCat.length < 1) {
        throw new NotFoundErr('there is no blog categories.');
    }
    res.status(StatusCodes.OK).json(blogCat);
}

const getBlogCategory = async(req,res) => {
    const {id} = req.params;
    const blogCat = await BlogCat.findById(id);
    if(!blogCat) throw new NotFoundErr(`there is no blog-category with id ${id}`);
    res.status(StatusCodes.OK).json(blogCat);
}

const updateBlogCategory = async(req,res) => {
    const {id} = req.params;
    const updatedBlogCat = await BlogCat.findByIdAndUpdate(
        id,
        {...req.body},
        {new:true}
    )
    if(!updatedBlogCat) throw new BadRequestErr('cannot update blog category');
    res.status(StatusCodes.OK).json(updatedBlogCat);
}

const deleteBlogCategory = async(req,res) => {
    const {id} = req.params;
    const blogCat = await BlogCat.findByIdAndDelete(id);
    if(!blogCat) throw new BadRequestErr('cannot delete blog category');
    res.status(StatusCodes.OK).json(blogCat); 
}

module.exports = {createBlogCategory,getBlogCategory,updateBlogCategory,deleteBlogCategory,getAllBlogCategories};