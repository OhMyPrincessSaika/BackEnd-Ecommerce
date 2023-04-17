const express = require('express');
const router = express.Router();
const {adminmiddleware,authmiddleware} = require('../middlewares/authmiddleware')
const {getAllUsers,getUser,updateUser,deleteUser, createCoupon, getAllCoupons, updateCoupon, deleteCoupon, giveCouponToUser,getCoupon, removeCouponFromUser, updateOrderStatus, getOrders} = require('../controllers/Admin-Controller');
router.route('/users').get(authmiddleware,adminmiddleware,getAllUsers);
router.route('/users/:id').get(authmiddleware,adminmiddleware,getUser).patch(authmiddleware,adminmiddleware,updateUser).delete(authmiddleware,adminmiddleware,deleteUser);
router.route('/coupon').post(authmiddleware,adminmiddleware,createCoupon).get(authmiddleware,adminmiddleware,getAllCoupons);
router.route('/coupon/:id').patch(authmiddleware,adminmiddleware,updateCoupon).delete(authmiddleware,adminmiddleware,deleteCoupon).get(authmiddleware,adminmiddleware,getCoupon);
router.route('/coupon/give-coupon/:id').post(authmiddleware,adminmiddleware,giveCouponToUser)
router.route('/coupon/remove-coupon/:id').post(authmiddleware,adminmiddleware,removeCouponFromUser)
router.route('/order/update-order').patch(authmiddleware,adminmiddleware,updateOrderStatus)
router.route('/order/getorders').get(getOrders)
module.exports = router;