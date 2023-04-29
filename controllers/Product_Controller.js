const {StatusCodes} = require('http-status-codes');
const mongoose = require('mongoose');
const {BadRequestErr,NotFoundErr, UnauthorizedErr, CustomErr} = require('../errors')
const {uploadImages,deleteImages} = require('../util/cloudinary');
const Product = require('../models/Product');
const slugify = require('slugify');
const User = require('../models/User');
const Cart = require('../models/Cart');
const fs = require('fs');
const createProduct = async(req,res) => {
    const {title} = req.body;
    const slug =await slugify(title);
    console.log(req.body)
    try{
        const product = await Product.create({...req.body,slug});
        if(!product) throw new BadRequestErr('something went wrong.please try again later');
        res.status(StatusCodes.OK).json(product);
    }catch(err) {
        console.log(err);
    }
}
const getProduct = async(req,res) => {
    const {id} = req.params;
    const product = await Product.findById(id);
    if(!product) throw new NotFoundErr(`cannot find product with this id ${id}`);
    res.status(StatusCodes.OK).json(product);
}
const updateProduct = async(req,res) => {
    const {id} = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(
        id,
        {...req.body},
        {new : true}
    )
    if(!updatedProduct) throw new BadRequestErr('failed to update.try again later');
    res.status(StatusCodes.OK).json(updatedProduct)
}
const getAllProducts = async(req,res) => {
    const {brand,name,category,sort,fields,numericFields,limit,page} = req.query;
    const queryObj = {};
    if(brand) {
        queryObj.brand = brand;
    }
    if(name) {
        queryObj.name = name;
    }
    if(category) {
        queryObj.category = category;
    }
    const Replacer = {
        "<" : "$lt",
        "<=" : "$lte",
        "=" : "$eq",
        ">" : "$gt",
        ">=" : "$gte"
    }
    if(numericFields) {
    const regExp = /\b(<|>|<=|>=|=)\b/g;
    let modifyString = numericFields.replace(regExp,(match) => `-${Replacer[match]}-`);
    modifyString = modifyString.split(',').forEach((comparison) =>  {
        const [key,operator,value] = comparison.split('-');
        queryObj[key] = { [operator] : value}
    });
    
    }
    const result =  Product.find(queryObj);
    if(page) {
        console.log(page,limit);
        const skip = (page-1) * limit;
        
        result.skip(skip).limit(limit);
    }
    if(sort) {
        result.sort(sort.split(',').join(' '));
    }
    if(fields) {
        result.select(fields.split(',').join(' '));
    }
    const products = await result;
    let totalRating;
    let totalStars=0;
    let totalReview=0;
    products?.map(async(product) => {
        if(product.ratings.length > 0) {
           product.ratings.map((rating) => {
             totalStars+= rating.star
             totalReview++;
           })
           totalRating = Math.round(totalStars/totalReview);
        }else {
            totalRating = 0;
        }
        await Product.findByIdAndUpdate(product._id,{totalRating},{new:true});
    });
    if(!products.length > 0) throw new NotFoundErr("there's no products");
    res.status(StatusCodes.OK).json({products,hits : products.length});
}
const deleteProduct = async(req,res) => {
    const {id} = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if(!deletedProduct) throw new BadRequestErr('failed to delete.try again later');
    res.status(StatusCodes.OK).json(deletedProduct);
}

const rateAProduct = async(req,res) => {
    const {star,comment} = req.body;
    const {productId} = req.params;
    const {id} = req.user;
    const product = await Product.findById(productId);
    const isAlreadyRated = product.ratings.find((item) => item.postedBy.toString() === id.toString());
    if(!isAlreadyRated) {
        const updateProduct = await Product.findByIdAndUpdate(
            productId,
            {$push : {ratings : {star,comment,postedBy:id}}},
            {new:true}
        )
        res.status(StatusCodes.OK).json(updateProduct);
    }else {
        const updatedproduct = await Product.updateOne(
            { ratings : {$elemMatch : isAlreadyRated}},
            { 
                $set : {'ratings.$.star' : star,'ratings.$.comment' : comment},
            },
            {new : true}
            )
        if(!product) throw new BadRequestErr('cannot rate a product');
        res.status(StatusCodes.OK).json(updatedproduct);

    }
}

const addToWishLists = async (req,res) => {
    const {productId} = req.params;
    const product = await Product.findById(productId);
    if(!product) throw new BadRequestErr('product does not exist.')
    const {id} = req.user;
    const user = await User.findByIdAndUpdate(
        id,
        {$push : {wishlists : {product : productId}}},
        {new :true}
    ).populate('wishlists.product');
    if(!user) throw new BadRequestErr('add to wish lists failed');
    res.status(StatusCodes.OK).json(user);
    
}

const addToCart = async(req,res) => {
    // console.log('add to cart')
    const {id} = req.user;
    const user = await User.findById(id);
    // console.log(user);
    const {count,color,product} = req.body;
    const obj = {};
    const products = [];
    obj.count = count;
    obj.color = color;
    obj.product = product;
    const findProduct = await Product.findById(product);
    if(!findProduct) throw new NotFoundErr(`there is no product with id ${id}`)
    const price = findProduct.price;
    const quantity = findProduct.quantity;
    obj.price = price;
    products.push(obj);
    // console.log({products});
    // console.log(findProduct);
    const cart = await Cart.findOne({userCart : user._id,'products.$.product':product})
    const productAlreadyExist = cart?.products?.find((item) => item.product.toString() === product);
    console.log(count, quantity)
    if(count > quantity) {
        console.log('count > quantity')
        throw new NotFoundErr('cannot add to cart more than its quantity')
    }
    if(quantity > 0) {
        if(!productAlreadyExist) {
            console.log('!productAlreadyExist')
            // const total = await Cart.findOne({orderBy : user._id})?.select('totalPrice').exec();
            // console.log(total?.totalPrice)
            // const totalPrice = (total ? total.totalPrice : 0)+ (price * count);
            // console.log(totalPrice)
            const increasePrice = price * count;
            const updatedProduct = await Cart.findOneAndUpdate(
                {userCart : user._id},
                {$push : { products},$inc : {totalPrice : increasePrice} },
                {new : true}
            )
            findProduct.quantity = quantity-1;
            await findProduct.save();
            if(!updatedProduct) {
                //create product in cart
                console.log('first time push item to cart')
                const firstPush = await Cart.create({products,userCart:user._id,totalPrice:obj.price});
                if(!firstPush)  throw new BadRequestErr('cannot add to cart');
                const pushProductIntoUserCart = await User.findByIdAndUpdate(
                    id,
                    {
                        cart : firstPush
                    },
                    {new :true}
                ).populate('cart')
                res.status(StatusCodes.OK).json(pushProductIntoUserCart)
            }else {
                const pushProductIntoUserCart = await User.findByIdAndUpdate(
                    id,
                    {
                        cart : updatedProduct
                    },
                    {new :true}
                ).populate('cart')
                res.status(StatusCodes.OK).json(pushProductIntoUserCart)
            }
            
        }else {
            console.log('product exist')
            const validProductId = mongoose.Types.ObjectId(product);
            //another solution
            // const cart = await Cart.findOne({orderBy : user._id,"products.product":validProductId});
            // if(cart) {
            //     cart.products.forEach((product) => {
            //         console.log(product.product,validProductId)
            //         if(product.product == validProductId) {
            //             console.log(product.product,validProductId)
            //             product.count += count
            //         }else {
            //             console.log('not equal')
            //         }
            //     })
            // await cart.save();
            // res.status(StatusCodes.OK).json(cart);
            // }
            const total = await Cart.findOne({userCart : user._id}).select("totalPrice").exec();
            const totalPrice =total.totalPrice + (price * count);
            console.log(total,totalPrice)
            const updatedProduct = await Cart.findOneAndUpdate(
                {
                  userCart: user._id,
                  "products.product": validProductId
                },
                {
                  $inc: { "products.$.count": count },
                  $set : {totalPrice}
                },
                { new: true }
              );
              const pushProductIntoUserCart = await User.findByIdAndUpdate(
                id,
                {
                    cart : updatedProduct
                },
                {new :true}
            ).populate('cart')
            
            findProduct.quantity = quantity-1;
            await findProduct.save();
            console.log('after reducing')
            res.status(StatusCodes.OK).json(pushProductIntoUserCart)
        }
       
    }else {
        res.status(StatusCodes.NOT_FOUND).json({msg : "already sold out"})
    }
}
const removeFromCart = async(req,res) => {
    const {product,price,color} = req.body;
    const productDoc = await Product.findById(product);
    if(!productDoc) {
        throw new NotFoundErr(`cannot find the product with id ${product}`)
    }
    const cartId = req.user.cart;
    const userCart = await Cart.findById(cartId);
    const matchedProduct = userCart.products.filter((product) => {
        return product === product
    })
    const findProduct = await Product.findById(product);
    const priceToBeRemoved = matchedProduct.length * findProduct.price;
    userCart.totalPrice = userCart.totalPrice - priceToBeRemoved;
    await userCart.save();
    const updatedUserCart = await Cart.findByIdAndUpdate(
        cartId,
        {
            $pull : {
                products : {
                        product
                }
            }
        },
        {new: true}
    )
    findProduct.quantity += matchedProduct.length;
    await findProduct.save();
    res.status(StatusCodes.OK).json(updatedUserCart);
}
const getUserCart = async(req,res) => {
    const {id} = req.user;
    const cart = await Cart.find({userCart:id});
    if(!cart.length>0) throw new NotFoundErr("there's no products in cart")
    res.status(StatusCodes.OK).json(cart);
}



module.exports = {createProduct,updateProduct,getProduct,getAllProducts,deleteProduct,rateAProduct,addToWishLists,addToCart,rateAProduct,getUserCart,removeFromCart}