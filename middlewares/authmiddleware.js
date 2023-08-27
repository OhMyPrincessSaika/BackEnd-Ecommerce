const {StatusCodes} = require('http-status-codes');
const User = require('../models/User');
const Admin  = require('../models/Admin');
const {UnauthorizedErr,BadRequestErr,DuplicateErr,NotFoundErr} = require('../errors')
const jwt = require('jsonwebtoken')
const authmiddleware = async(req,res,next) => {
    console.log('authmiddleware')
    const auth = req.headers.authorization;
    if(!auth || !auth.startsWith('Bearer')) throw new UnauthorizedErr('Unauthoried to access');
    const token = auth.split(' ')[1];
    const decode = await jwt.verify(token,process.env.JWT_SECRET);
    req.user = await User.findById(decode.id);
    next();
}

const adminmiddleware = async(req,res,next) => {
    const {_id} = req.user
    const user = await User.findById(_id);
    if(!user) throw new NotFoundErr(`cannot find user with id ${_id}`);
    console.log(user.isAdmin);
    if(!user.isAdmin) throw new UnauthorizedErr('you are not admin');
    next();
}

module.exports = {authmiddleware,adminmiddleware}