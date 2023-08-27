const {StatusCodes} = require('http-status-codes');
const User = require('../models/User');
const {NotFoundErr, BadRequestErr} = require('../errors')
const Coupon = require('../models/Coupon');
const Admin = require('../models/Admin');
const Notification = require('../models/Notification');
const BadRequestError = require('../errors/BadRequestErr');
const getAllUsers = async(req,res) => {
    const users = await User.find({});
    if(!users.length > 0) throw NotFoundErr('there is no users');
    res.status(StatusCodes.OK).json(users);
}

const getUser = async(req,res) => {
    const {id} = req.params;
    const user = await User.findById(id);
    if(!user) throw new NotFoundErr(`there is no user with id ${id}`);
    res.status(StatusCodes.OK).json(user);
}

const updateUser = async(req,res) => {
    const {id} = req.params;
    const updatedUser = await User.findByIdAndUpdate(
        id,
        {...req.body},
        {new :true}
    )
    if(!updatedUser) throw new BadRequestErr('something went wrong while updating..');
    res.status(StatusCodes.OK).json(updatedUser);
}

const deleteUser = async(req,res) => {
    const {id} = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if(!deleteUser) throw new BadRequestErr('something went wrong while deleting...');
    res.status(StatusCodes.OK).json(deletedUser);
}

const createCoupon = async(req,res) => {
    const {coupon,expiry,discountPercent} = req.body;
    const isCouponAlreadyExist = await Coupon.findOne({name : coupon});
    if(isCouponAlreadyExist) throw new BadRequestErr('Coupon already exist');
    const newCoupon = await Coupon.create({
        name : coupon,
        expiry,
        discountPercent
    })
    if(!newCoupon ) throw new BadRequestErr('Coupon creation failed')
    res.status(StatusCodes.OK).json(newCoupon);
}
const getAllCoupons = async(req,res) => {
    const coupons = await Coupon.find({});
    if(!coupons.length > 0) throw new NotFoundErr("There's no coupon");
    res.status(StatusCodes.OK).json(coupons);
}
const giveCouponToUser = async(req,res) => {
    const {couponId} = req.body;
    const {id} = req.params;
    const user = await User.findById(id);
    if(!user) throw new NotFoundErr(`There is no user with id ${id}`);
    const coupon = await Coupon.findById(couponId);
    if(!coupon)  throw new NotFoundErr(`There is no coupon with id ${couponId}`);
    const couponAlreadyExist = await User.findOne({
        "coupons.coupon": couponId
    })
    if(couponAlreadyExist) {
        res.status(StatusCodes.CONFLICT).json({msg : "coupon already exists"})
    }else {
        const giveToUser = await User.findByIdAndUpdate(
            id,
            {$push : { coupons : {coupon : coupon._id}}},
            {new :true}
        ).populate('coupons.coupon')
    
        // const populate = await User.findById(id).populate("coupons.coupon");
        if(!giveToUser) throw new BadRequestErr('something went wrong.cannot give coupon to user');
        res.status(StatusCodes.OK).json(giveToUser);
    }
    
}
const removeCouponFromUser = async(req,res) => {
    const {id} = req.params;
    const {couponId} = req.body;
    const user = await User.findById(id);
    if(!user) throw new NotFoundErr(`there is no user with id ${id}`);
    const coupon = await Coupon.findById(couponId);
    const couponExist = await User.findOne({
        "coupons.coupon": couponId
    })
    if(couponExist) {
        const removedUser = await User.findByIdAndUpdate(
            id,
            {$pull : {
                coupons : {coupon : coupon._id}
            }},
            {new :true}
        ).populate('coupons.coupon')
        res.status(StatusCodes.OK).json(removedUser);
    }else {
       res.status(StatusCodes.BAD_REQUEST).json({msg : `there is no coupon with id ${couponId}`})
    }
}
const getCoupon = async(req,res) => {
    const {id} = req.params;
    const coupon = await Coupon.findById(id);
    if(!coupon) throw new NotFoundErr(`There is no coupon with id ${id}`);
    res.status(StatusCodes.OK).json(coupon);
}

const updateCoupon = async(req,res) => {
    const {id} = req.params;
    const {coupon,expiry,discountPercent} = req.body;
    const updatedcoupon = await Coupon.findByIdAndUpdate(
        id,
        {name:coupon,...req.body},
        {new :true}
    )
    if(!coupon) throw new BadRequestErr('There is no coupon to update');
    res.status(StatusCodes.OK).json(updatedcoupon);
}

const deleteCoupon = async (req,res) => {
    const {id} = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);
    if(!coupon)  throw new BadRequestErr('There is no coupon to delete');
    const deleteCouponFromUser = await User.findByIdAndUpdate(
        req.user.id,
        {$pull : {coupons : {coupon : id}}},
        {new:true}
    )
    res.status(StatusCodes.OK).json(coupon);
}


//admin


const getAllAdmins = async(req,res) => {
   
    console.log('here')
    const allAdmins = await Admin.find({});
    
    if(allAdmins.length !== 0) {
        res.status(StatusCodes.OK).json(allAdmins);
    }else {
        throw new NotFoundErr('There is no admins');
    }
}
const updateAdmin = async(req,res) => {
    const {id} = req.params;
    const updatedData = await Admin.findByIdAndUpdate(
        id,
        {...req.body},
        {new: true}
    );
    res.status(StatusCodes.OK).json(updatedData);
}

const getAdmin = async(req,res) => {
    const {id} = req.params;
    const admin = await Admin.findById(id);
    res.status(StatusCodes.OK).json(admin);
}

const deleteAdmin = async(req,res) => {
    const {id} = req.params;
    const deletedAdmin = await Admin.findByIdAndDelete(id);
    res.status(StatusCodes.OK).json(deletedAdmin);
}

const addNotification = async(req,res) => {
    const {name,description,read} = req.body;
    console.log(name,description,read);
    const createdNotification = await Notification.create({
        name,
        description,
        read
    });
    res.status(StatusCodes.OK).json(createdNotification);
}

const getAllNotifications = async(req,res) => {
    const notifications = await Notification.find({});
    const unreadNotis = notifications?.filter((noti) => noti.read !== true);
    const readNotis = notifications?.filter((noti) => noti.read === true);
    
    const arr = [];
    unreadNotis.map((noti) =>  arr.push(noti));
    readNotis.map((noti) => arr.push(noti));    
    
    res.status(StatusCodes.OK).json(arr);
}

const updateNotifications = async(req,res) => {
    const {id} = req.params;
    console.log(id);
    const updatedNoti = await Notification.findByIdAndUpdate(
        id,
        {
            read : true
        },
        {
            new : true
        }
    )
    res.status(StatusCodes.OK).json(updatedNoti);
}
module.exports = {getAllUsers,getUser,updateUser,deleteUser,createCoupon,getAllCoupons,giveCouponToUser,updateCoupon,getAllNotifications,deleteCoupon,getCoupon,removeCouponFromUser,getAdmin,updateAdmin,deleteAdmin,getAllAdmins,addNotification,updateNotifications};