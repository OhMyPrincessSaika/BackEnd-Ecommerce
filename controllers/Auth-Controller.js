const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const cookie = require('cookie-parser');
const {NotFoundErr, BadRequestErr, UnauthorizedErr} = require('../errors')
const register = async(req,res) => {
    const {email,firstname,lastname,password,phonenum} = req.body;
    const user = await User.create({
        email,firstname,lastname,password,phonenum
    })
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
module.exports = {register,login}