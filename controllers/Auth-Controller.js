const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const cookie = require('cookie-parser');
const Admin = require('../models/Admin');
const {NotFoundErr, BadRequestErr, UnauthorizedErr} = require('../errors');
const BadRequestError = require('../errors/BadRequestErr');
const register = async(req,res) => {
    const {email,firstname,lastname,password,phonenum} = req.body;
    const user = await User.create({
        email,firstname,lastname,password,phonenum
    })
    console.log(user);
    const token =await user.createJWT();
    res.status(StatusCodes.OK).json({user,token});
}
const login = async(req,res) => {
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(!user) throw new NotFoundErr("The email doesn't exist")
    const isPasswordMatch = await user.comparePassword(password);
    if(!isPasswordMatch) throw new UnauthorizedErr('The password is not correct.Please try again.');
    const token = await user.createJWT();
    res.cookie("JWT_TOKEN",token,{httpOnly :true,maxAge : 24 * 60 * 60})
    res.status(StatusCodes.OK).json({user,token})
}

const adminRegister = async(req,res) => {
    const {firstname,lastname,email,password,adminId} = req.body;
    if(!firstname || !lastname || !email || !password || !adminId) {
        throw new BadRequestErr('firstname,lastname,password,email or adminId is required.');
    }
    if(adminId !== process.env.ADMIN_ID) {
        throw new UnauthorizedErr('You are not authorized to create admin account!contact:<thurahtetzaw02@gmail.com>');
    }
    const admin =await Admin.create({...req.body});
    const token = await admin.createJWT();
    res.status(StatusCodes.OK).json({admin,token});
}

const adminLogin = async(req,res) => {
    const {email,password} = req.body;
    const admin = await Admin.findOne({
        email
    });
    if(!admin) throw new NotFoundErr(`${email} doesn't exist in admin's emails.`);
    const isPassCorrect = await admin.comparePassword(password);
    if(!isPassCorrect) {
        throw new BadRequestError('password is not correct!try again.');
    }
    const token = await admin.createJWT();
    res.cookie('AD_JWT_TOKEN',token,{httpOnly:true,maxAge : 24 * 60 * 60});
    res.status(StatusCodes.OK).json({admin,token})
}
module.exports = {register,login,adminRegister,adminLogin}