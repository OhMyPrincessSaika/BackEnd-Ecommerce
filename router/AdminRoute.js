const express = require('express');
const router = express.Router();
const {adminmiddleware,authmiddleware} = require('../middlewares/authmiddleware')
const {getAllUsers,getUser,updateUser,deleteUser, createCoupon, getAllCoupons, updateCoupon, deleteCoupon, giveCouponToUser,getCoupon, removeCouponFromUser, updateOrderStatus, getOrders, getAllAdmins, createAdmin, getAdmin, updateAdmin, deleteAdmin,addNotification, getAllNotifications, updateNotifications} = require('../controllers/Admin-Controller');
router.route('/users').get(authmiddleware,getAllUsers);
router.route('/users/:id').get(authmiddleware,getUser).patch(authmiddleware,updateUser).delete(authmiddleware,deleteUser);
router.route('/coupon').post(authmiddleware,createCoupon).get(authmiddleware,getAllCoupons);
router.route('/coupon/:id').patch(authmiddleware,updateCoupon).delete(authmiddleware,deleteCoupon).get(authmiddleware,getCoupon);
router.route('/coupon/give-coupon/:id').post(authmiddleware,adminmiddleware,giveCouponToUser)
router.route('/coupon/remove-coupon/:id').post(authmiddleware,removeCouponFromUser);
router.route('/authority/').get(getAllAdmins);
router.route('/authority/noti/:adminId').patch(addNotification)
router.route('/authority/noti').get(getAllNotifications);
router.route('/authority/update-noti/:id').patch(updateNotifications)
router.route('/authority/:id').get(getAdmin).patch(updateAdmin).delete(deleteAdmin);
module.exports = router;