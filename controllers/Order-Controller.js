const User =  require('../models/User');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const {StatusCodes} = require('http-status-codes');
const { BadRequestErr, CustomErr, NotFoundErr } = require('../errors');
const createOrder = async(req,res) => {
    const {id} = req.user;
    const user = await User.findById(id);
    const userCart = await Cart.findById(user.cart);
    const isCouponApplied = user.couponApplied;
    const {products} = await Cart.findOne({userCart : req.user.id}).populate('products.product');
    console.log(products);
    const update = products.map(async(item) => {
        const product = item.product;
        if(product?.quantity > 0) {
            await Product.findByIdAndUpdate(
                product._id,
                {$inc : {quantity : -product.quantity,sold : +product.quantity}}
            )
            const cart = await Cart.findOne(
                {"products.$.product" : product._id}
            )
            console.log(cart);
        }else {
            console.log('quantity is 0')
            return;
        }
    })
    let finalAmount = 0;
    if(isCouponApplied) {
        finalAmount = userCart.discountPrice;
    }else {
        finalAmount = userCart.totalPrice
    }
    const shouldCreateProduct = products.every((product) => product.product != null);
    console.log(shouldCreateProduct)
    if(shouldCreateProduct) {
        const newOrder = await Order.create({
            products,
            orderBy:req.user.id,
            paymentIntent : {
                currency : "usd",
                method  : "COD",
                status : "Cash On Delivery",
                created : Date.now(),
                amount : finalAmount
            }
        })

        res.status(StatusCodes.OK).json(newOrder);
    }else {
        throw new BadRequestErr('cannot create order without product(s) in your cart.')
    }
}



const updateOrderStatus = async(req,res) => {
    const {id} = req.user;
    const {orderStatus} = req.body;
    const orderToBeUpdated = await Order.findOneAndUpdate(
        {orderBy : id},
        {orderStatus},
        {new :true}
    )
    res.status(StatusCodes.OK).json(orderToBeUpdated);
}

const getOrders = async(req,res) => {
    const orders = await Order.find({}).populate('orderBy products.product')
    console.log(orders);
    if(orders.length < 1) {
        throw new NotFoundErr('there is no orders');
    }
   
    res.status(StatusCodes.OK).json(orders);
}

const getOrdersByUserId = async(req,res) => {
    const {id} = req.params;
    try {
        const orders = await Order.find({orderBy : id}).populate('orderBy products.product');
        if(orders.length < 1) {
            throw new NotFoundErr(`there is no orders by this user id ${id}`)
        }
        res.status(StatusCodes.OK).json(orders);
    }catch (err) {
        throw new BadRequestErr(err.message);
    }

}
module.exports ={createOrder,updateOrderStatus,getOrders,getOrdersByUserId};