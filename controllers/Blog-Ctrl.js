const Blog = require('../models/Blog');
const {StatusCodes} = require('http-status-codes');
const {NotFoundErr,BadRequestErr} = require('../errors');
const createBlog = async(req,res) => {
    const createdBlog = await Blog.create({...req.body});
    if(!createBlog) throw new BadRequestErr('cannot create blog');
    res.status(StatusCodes.OK).json(createdBlog)
}

const getAllBlogs = async(req,res) => {
    const blogs = await Blog.find({});
    if(blogs.length < 1) {
        throw new NotFoundErr('there is no blogs');
    }
    res.status(StatusCodes.OK).json(blogs);
}

const getBlog = async(req,res) => {
    const {id} = req.params;
    const blog = await Blog.findById(id);
    if(!blog) throw new NotFoundErr(`there is no blog with id ${id}`);
    res.status(StatusCodes.OK).json(blog);
}

const updateBlog = async(req,res) => {
    const {id} = req.params;
    const updatedBlog = await Blog.findByIdAndUpdate(
        id,
        {...req.body},
        {new:true}
    )
    if(!updatedBlog) throw new BadRequestErr('cannot update blog');
    res.status(StatusCodes.OK).json(updatedBlog);
}

const deleteBlog = async(req,res) => {
    const {id} = req.params;
    const blog = await Blog.findByIdAndDelete(id);
    if(!blog) throw new BadRequestErr('cannot delete blog');
    res.status(StatusCodes.OK).json(blog); 
}

module.exports = {createBlog,getBlog,updateBlog,deleteBlog,getAllBlogs};