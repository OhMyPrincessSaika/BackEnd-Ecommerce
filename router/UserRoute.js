const express = require('express');
const router = express.Router();
const { updatePassword, forgotPassword, resetPassword, getAllCoupons, applyCoupon, createOrder } = require('../controllers/User-Controller');
const {authmiddleware} = require('../middlewares/authmiddleware');

router.route('/password/forgotpassword').post(authmiddleware,forgotPassword)
router.route('/password/update-password').post(authmiddleware,updatePassword)
router.route('/password/reset-password/:token').post(resetPassword)
router.route('/coupon').get(getAllCoupons);
router.route('/coupon/apply-coupon/:couponId').post(authmiddleware,applyCoupon)
module.exports = router;
