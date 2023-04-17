const {StatusCodes} = require('http-status-codes');
const {NotFoundErr,BadRequestErr,DuplicateErr} = require('../errors');
const Color = require('../models/Color');

const createColor = async(req,res) => {
    const {color } = req.body;
    const isAlreadyExist = await Color.findOne({color});
    if(isAlreadyExist) {
        throw new DuplicateErr('color already exist');
    }
    const createdColor = await Color.create({color});
    if(!createdColor ) {
        throw new BadRequestErr('cannot create color');
    }
    return res.status(StatusCodes.OK).json(createdColor);
}

const getColors = async(req,res) => {
    const colors = await Color.find({});
    if(colors.length < 1) {
        throw new NotFoundErr('there is no color');
    }
    return res.status(StatusCodes.OK).json(colors)
}

const getColor = async(req,res) => {
    const {id} = req.params;
    const color = await Color.findById(id);
    if(!color) throw new NotFoundErr(`there is no color with id ${id}`);
    return res.status(StatusCodes.OK).json(color);
}
const updateColor = async(req,res) => {
    const {id} = req.params;
    const updatedColor = await Color.findByIdAndUpdate(
        id,
        {...req.body},
        {new:true}
    )
    if(!updatedColor) throw new BadRequestErr('cannot update the color');
    return res.status(StatusCodes.OK).json(updatedColor);
}

const deleteColor = async(req,res) => {
    const {id} = req.params;
    const deletedColor=  await Color.findByIdAndDelete(id);
    if(!deletedColor ) throw new NotFoundErr(`there is no color with id ${id} to delete`) 
    return res.status(StatusCodes.OK).json(deletedColor)
}

module.exports = {createColor,getColor,getColors,updateColor,deleteColor}