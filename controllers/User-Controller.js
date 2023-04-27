const { BadRequestErr, CustomErr, NotFoundErr } = require('../errors');
const User = require('../models/User');
const Cart = require('../models/Cart');
const Order = require('../models/Order')
const {StatusCodes} = require('http-status-codes');
const crypto = require('crypto');
const sendEmail = require('../controllers/Email-Controller');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const updatePassword = async(req,res) => {
    const {password} = req.body;
    const {id} = req.user;
    const user = await User.findById(id);
    if(!user) throw new BadRequestErr('something went wrong.please try again later');
    user.password = password;
    const updatedPassword = await user.save();
    res.status(StatusCodes.OK).json(updatedPassword);
}

const forgotPassword = async(req,res) => {
    const {id,email} = req.user;
    const user = await User.findById(id);
    if(!user) throw new BadRequestErr(`there is no user with id ${id}`);
    const token = await user.generateResetToken();
    await user.save();
    const resetUrl = `To reset password.Please follow below link.This link is valid till 10 minutes.<br><a href='${process.env.BASE_URL}/user/password/reset-password/${token}'>Click Here</a>`;
    const data = {
        to : email,
        subject : "Password Reset Link",
        text : "This is a link to reset password",
        htm : resetUrl
    }
    sendEmail(data)
    res.json(data);
}

const resetPassword = async(req,res) => {
    const {password} = req.body;
    const {token} = req.params;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    console.log(hashedToken)
    let user = await User.findOne({
            passwordResetToken : hashedToken,
            passwordResetExpires : {$gt : Date.now()}
    })
    if(!user) throw new BadRequestErr('Your token is invalid.')
    user.password = password;
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
    await user.save();
    res.status(StatusCodes.OK).json({user,status : "success"});
}

const getAllCoupons = async(req,res) => {
    const coupons = await Coupon.find({});
    if(!coupons.length > 0) throw new NotFoundErr("You don't have no coupon");
    res.status(StatusCodes.OK).json(coupons);
}

const applyCoupon = async(req,res) => {
    const {id} = req.user;
    
    const {couponId} = req.params;
    
    const couponToBeApplied = await Coupon.findById(couponId).select('discountPercent').exec();
    const user = await User.findById(id);
    let cartId = user.cart;
    const cart = await Cart.findById(cartId);
    const discountPercent = couponToBeApplied.discountPercent;
    const discountPrice = Math.round((cart.totalPrice * discountPercent)/100);
    const priceAfterDiscount = cart.totalPrice - discountPrice
    if(cart.discountPrice) {
        return res.status(StatusCodes.CONFLICT).json({msg: "You already have applied one coupon.You can't apply two coupons in one purchase."});
    }else {
        await Cart.findByIdAndUpdate(
            cartId,
            {
                discountPrice : priceAfterDiscount
            }
        )
        const updatedUser = await User.findByIdAndUpdate(
            id,
            {couponApplied : true,$pull : {coupons : {coupon : couponId}}},
            {new:true}
        ).populate('cart');
        res.status(StatusCodes.OK).json(updatedUser);
    }
}



module.exports = {updatePassword,forgotPassword,resetPassword,getAllCoupons,applyCoupon}