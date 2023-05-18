const express = require('express');
const router = express.Router();
// const {uploadProductImages} = require('../controllers/UploadCtrl')
const {createProduct,updateProduct,uploadProductImages,getProduct,getAllProducts,deleteProduct, rateAProduct, addToWishLists, addToCart, getUserCart, removeFromCart, removeFromWishlist, emptyCart, updateUserCart, getTags} = require('../controllers/Product_Controller');
const {authmiddleware} = require('../middlewares/authmiddleware');

router.route('/').post(createProduct).get(getAllProducts);
router.route('/tags/get-all-tags').get(getTags)
router.route('/:id').patch(updateProduct).get(getProduct).delete(deleteProduct);
router.route('/rating/:productId').post(authmiddleware,rateAProduct)
router.route('/wishlist/products/:productId').post(authmiddleware,addToWishLists);
router.route('/wishlist/remove/:productId').patch(authmiddleware,removeFromWishlist)
router.route('/cart/add-to-cart').post(authmiddleware,addToCart);
router.route('/cart/products').get(authmiddleware,getUserCart);
router.route('/cart/remove-from-cart/:cartItemId').delete(authmiddleware,removeFromCart)
router.route('/cart/empty-cart').delete(authmiddleware,emptyCart);
router.route('/cart/update-cart/:cartItemId').patch(authmiddleware,updateUserCart)

module.exports = router;