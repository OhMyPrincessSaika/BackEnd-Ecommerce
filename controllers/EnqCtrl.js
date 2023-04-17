
const {StatusCodes} = require('http-status-codes');
const {NotFoundErr,BadRequestErr,DuplicateErr} = require('../errors');
const Enquiry = require('../models/EnqModel');

const createEnquiry = async(req,res) => {
    
    const isAlreadyExist = await Enquiry.findOne({...req.body});
    if(isAlreadyExist) {
        throw new DuplicateErr('enquiry already exist');
    }
    const createdEnquiry = await Enquiry.create({...req.body});
    if(!createdEnquiry ) {
        throw new BadRequestErr('cannot create enquiry');
    }
    return res.status(StatusCodes.OK).json(createdEnquiry);
}

const getEnquiries = async(req,res) => {
    const enquiries = await Enquiry.find({});
    if(enquiries.length < 1) {
        throw new NotFoundErr('there is no enquiry');
    }
    return res.status(StatusCodes.OK).json(enquiries)
}

const getEnquiry = async(req,res) => {
    const {id} = req.params;
    const enquiry = await Enquiry.findById(id);
    if(!enquiry) throw new NotFoundErr(`there is no enquiry with id ${id}`);
    return res.status(StatusCodes.OK).json(enquiry);
}
const updateEnquiry = async(req,res) => {
    console.log('update section')
    const {id} = req.params;
    const updatedEnquiry = await Enquiry.findByIdAndUpdate(
        id,
        {...req.body},
        {new:true}
    )
    if(!updatedEnquiry) throw new BadRequestErr('cannot update the enquiry');
    return res.status(StatusCodes.OK).json(updatedEnquiry);
}

const deleteEnquiry = async(req,res) => {
    const {id} = req.params;
    const deletedEnquiry=  await Enquiry.findByIdAndDelete(id);
    if(!deletedEnquiry ) throw new NotFoundErr(`there is no enquiry with id ${id} to delete`) 
    return res.status(StatusCodes.OK).json(deletedEnquiry)
}

module.exports = {createEnquiry,getEnquiry,getEnquiries,updateEnquiry,deleteEnquiry}