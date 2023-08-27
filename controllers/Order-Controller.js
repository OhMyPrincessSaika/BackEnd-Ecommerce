const User =  require('../models/User');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const {StatusCodes} = require('http-status-codes');
const { BadRequestErr, CustomErr, NotFoundErr } = require('../errors');
const createOrder = async(req,res) => {
   const {shippingInfo,orderItems,totalPrice,totalPriceAfterDiscount,user} = req.body;
   
   try {
    const order = await Order.create({
        shippingInfo,orderItems,totalPrice,totalPriceAfterDiscount,user 
    })
    res.status(StatusCodes.OK).json({order,success:true})
   }catch(err) {
        console.log(err);
   }

}





const updateOrderStatus = async(req,res) => {
    const {id} = req.params;
    const {orderStatus} = req.body;
    console.log(orderStatus)
    const orderToBeUpdated = await Order.findByIdAndUpdate(
        id,
        {orderStatus},
        {new :true}
    )
    console.log(orderToBeUpdated)
    res.status(StatusCodes.OK).json(orderToBeUpdated);
}

const getOrderById = async(req,res) => {
    const {id} = req.params;
    const order = await Order.findById(id).populate('orderItems.product user');
    res.json(order);
}

const getMyOrder = async(req,res) => {
    const {id} = req.user;
    const orders = await Order.find({user : id}).populate('user orderItems.product');
    res.status(StatusCodes.OK).json(orders);
}

const getMonthOrderIncome = async(req,res) => {
    let monthName = ["January","February","March","April","May","June","July",
    "August","September","October","November","December"];
    let d = new Date();
    let endDate = "";
    d.setDate(1);
    for(let i=0; i < 11; i++) {
        d.setMonth(d.getMonth() -1);
        console.log(d.getMonth())
        endDate = monthName[d.getMonth()]+' '+d.getFullYear();
    }
    const data = await Order.aggregate([
        {
            $match : {
               createdAt : {
                $lte : new Date(),
                $gte : new Date(endDate)
               } 
            }
        },{
            $group : {
                _id : {
                    month : "$month"
                },
                amount : {$sum : "$totalPriceAfterDiscount"},
                count : {$sum : 1}
            }
        }
    ])
    res.json(data);

}


const getYearlyOrderIncome = async(req,res) => {
    const monthName = ["January","February","March","April","May","June","July",
    "August","September","October","November","December"];
    let d = new Date();
    let endDate = '';
    d.setDate(1);
    for( let i=0; i<=11; i++) {
        d.setMonth(d.getMonth() - 1);
        if(i==11) {
            endDate = monthName[d.getMonth()] + " " + d.getFullYear(); 
        }
    }
    console.log(endDate);
    const data = await Order.aggregate([
        {
            $match : {
                createdAt : {

                    $lte : new Date(),
                    $gte : new Date(endDate)
                }
            }
        },{
            $group : {
                _id : null,
                count : {$sum : 1},
                amount : {$sum : '$totalPriceAfterDiscount'}
            }
        }
    ])
    res.json(data);
}

const getAllOrders = async(req,res) => {
    const orders = await Order.find({}).sort('-createdAt').populate('user');
    if(orders.length < 1) {
        throw new NotFoundErr('there is no orders yet.');
    }
    res.json(orders);
}
module.exports ={
    createOrder,
    updateOrderStatus,
    getMyOrder,
    getMonthOrderIncome,
    getYearlyOrderIncome,
    getAllOrders,
    getOrderById
};