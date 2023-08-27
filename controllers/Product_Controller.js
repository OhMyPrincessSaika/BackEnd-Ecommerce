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
const getTags = async(req,res) => {
    const allProducts = await Product.find({});
    const tagsArr = Array.from(allProducts.map((product) => {
        return product.tag;
    }))
    res.status(StatusCodes.OK).json(tagsArr);
}
const getProduct = async(req,res) => {
    const {id} = req.params;
    
    const product = await Product.findById(id).populate('ratings.postedBy');
    if(!product) throw new NotFoundErr(`cannot find product with this id ${id}`);
    let avgRating = 0;

    for(let i=0; i<product?.ratings?.length; i++) {
        avgRating += product?.ratings[i].star;
    }
    if(avgRating !== 0 ) {
        product.totalRating = (avgRating / product?.ratings?.length).toString();
        
        await product.save();
        res.status(StatusCodes.OK).json(product);
    }else {
        res.status(StatusCodes.OK).json(product);
    }
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
    const {brand,name,category,sort,fields,tag,numericFields,limit,page} = req.query;
    console.log(numericFields,name)
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
    if(tag) {
        queryObj.tag = tag;
    }
    console.log(queryObj);
    const Replacer = {
        "<" : "$lt",
        "<=" : "$lte",
        "=" : "$eq",
        ">" : "$gt",
        ">=" : "$gte"
    }
    if(numericFields) {
        console.log('here')
    const regExp = /\b(<|>|<=|>=|=)\b/g;
    let modifyString = numericFields.replace(regExp,(match) => `-${Replacer[match]}-`);
    // console.log(modifyString)
    let arr = [];
    modifyString = modifyString.split(',').forEach((comparison) =>  {
        const [key,operator,value] = comparison.split('-');
        if(key==='price') {
            queryObj[key] = { [operator] : value}
            arr.push(queryObj[key]);
        }
    });
    if(arr.length > 1) {
        queryObj.price = Object.assign({},arr[0],arr[1]);
    } 
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

    // let totalRating;
    // let totalStars=0;
    // let totalReview=0;
    // products?.map(async(product) => {
    //     if(product.ratings.length > 0) {
    //        product.ratings.map((rating) => {
    //          totalStars+= rating.star
    //          totalReview++;
    //        })
    //        totalRating = Math.round(totalStars/totalReview);
    //     }else {
    //         totalRating = 0;
    //     }
    //     await Product.findByIdAndUpdate(product._id,{totalRating},{new:true});
    // });
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
    // const product = await Product.findById(productId);
    // const isAlreadyRated = product.ratings.find((item) => item.postedBy.toString() === id.toString());
    // console.log(isAlreadyRated)
    // if(!isAlreadyRated) {
    //     console.log('new');
    //     try {
            const updateProduct = await Product.findByIdAndUpdate(
                productId,
                {$push : {ratings : {star,comment,postedBy:id}}},
                {new:true}
            )
            await updateProduct.populate('ratings.postedBy')
            res.status(StatusCodes.OK).json(updateProduct);
    //     }catch(err) {
    //         console.log(err);
    //     }
      
    // }else {
    //     console.log('already')
    //     try {
    //         const updatedproduct = await Product.findOneAndUpdate(
    //             {"ratings.postedBy" : id},
    //             { 
    //                 $set : {'ratings.$.star' : star,'ratings.$.comment' : comment},
    //             },
    //             {new : true}
    //             ).populate('ratings.postedBy')
            
    //         console.log(updatedproduct)
    //         res.status(StatusCodes.OK).json(updatedproduct);
    //     }catch(err) {
    //         console.log(err);
    //     }
       

    // }
}

const addToWishLists = async (req,res) => {
    console.log('add to wishlists')
    const {productId} = req.params;
    const product = await Product.findById(productId);
    if(!product) throw new BadRequestErr('product does not exist.')
    const {id} = req.user;
    const objectId = mongoose.Types.ObjectId(productId);
    const user = await User.findById(id);
    const isProductExist = user.wishlists.find((product) => {
        console.log(product.product.toString()===objectId.toString());
        return product.product.toString() === objectId.toString()
    }); 
    console.log(isProductExist)
    if(isProductExist) {
        throw new BadRequestErr('product is already in wishlist');
    } else {
      const updatedUser = await User.findByIdAndUpdate(
       id,
       {
        $push  : {
            wishlists : {product : productId}
        }
       },
       {
        new : true
       }
    );
        if(!updatedUser) throw new BadRequestErr('add to wish lists failed');
        res.status(StatusCodes.OK).json(updatedUser);

    }
    
}
const removeFromWishlist = async(req,res) => {
    const {productId} = req.params;
    const product = await Product.findById(productId);
    if(!product) throw new BadRequestErr('product doesn\'t exist ');
    const {id} = req.user;
    const user = await User.findByIdAndUpdate(
        id,
        {
            $pull : {wishlists : {product : productId}}
        },
        {
            new : true
        }
    )
    if(!user) throw new BadRequestErr('remove from wish lists failed');
    res.status(StatusCodes.OK).json(user);
}
const addToCart = async(req,res) => {
    const {id} = req.user;
    const {productId,quantity,price,color,size} = req.body;
    const isCartExist =await Cart.findOne({userId : id});
    const isColorExist = isCartExist?.color?.find((item) => item === color);
   
    if(!isCartExist) {
        try {
            const addToCart = await Cart.create({userId :id,...req.body});
            console.log(addToCart);
            if(!addToCart) throw new BadRequestErr('cannot add to cart.')
            return res.status(StatusCodes.OK).json(addToCart);
        }catch(err) {
            console.log(err);
        }
    }else {
        try {
            let updateCart;
            if(isColorExist) {
                 updateCart = await Cart.findOneAndUpdate(
                    {userId : id},
                    {$push : {size},$inc : {quantity}},
                    {new :true}
                    )
            }else {
                updateCart = await Cart.findOneAndUpdate(
                    {userId : id},
                    {$push : {color,size},$inc : {quantity}},
                    {new :true}
                    )
            }
           
            return res.status(StatusCodes.OK).json(updateCart);
        }catch(err) {
            console.log(err);
        }
    }
   
   
}
const removeFromCart = async(req,res) => {
  const {id} = req.user;
  const {cartItemId} = req.params;

  const deletedCart = await Cart.deleteOne(
    {userId :id, _id : cartItemId}
  );
  if(!deletedCart) throw new BadRequestErr('Cannot delete cart item');
  res.status(StatusCodes.OK).json(deletedCart);
}
const emptyCart = async(req,res) => {
    const {id} = req.user;
    const deletedAll = await Cart.deleteMany({userId : id});
    res.status(StatusCodes.OK).json(deletedAll);
}
const getUserCart = async(req,res) => {
    const {id} = req.user;
    const cart = await Cart.find({userId:id}).populate('productId');
    if(!cart.length>0) throw new NotFoundErr("there's no products in cart")
    res.status(StatusCodes.OK).json(cart);
}

const updateUserCart = async(req,res) => {
    const {id} = req.user;
    const {cartItemId} = req.params;
    const  {quantity,color,price} = req.body;
    console.log(quantity,price)
    const updatedUserCart = await Cart.findOneAndUpdate(
        {_id : cartItemId, userId : id},
        {
            $inc : {quantity : quantity,price : price},
            $push : { color : color}
        },

        {new : true}
    )
    if(!updatedUserCart) throw new BadRequestErr(`cannot update the cart item id ${cartItemId}`);
    res.status(StatusCodes.OK).json(updatedUserCart);
}

const addSize = async(req,res) => {
    const {id} = req.params;
    const { size } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
        id,
        {
            $push : {size}
        },
        {
            new : true
        }
    )
    res.status(StatusCodes.OK).json(updatedProduct);
}


module.exports = {addSize,createProduct,updateProduct,getTags,getProduct,getAllProducts,emptyCart,updateUserCart,deleteProduct,rateAProduct,addToWishLists,removeFromWishlist,addToCart,rateAProduct,getUserCart,removeFromCart}