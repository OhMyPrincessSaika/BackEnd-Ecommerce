const express = require('express');
const router = express.Router();
const {authmiddleware} = require('../middlewares/authmiddleware');
const {createOrder , getMyOrder, getMonthOrderIncome, getYearlyOrderIncome, getAllOrders, getOrderById, updateOrderStatus} = require('../controllers/Order-Controller');
router.post('/',authmiddleware,createOrder);
router.get('/:id',authmiddleware,getOrderById)
router.patch('/u/update_order',authmiddleware,updateOrderStatus)
router.get('/admin/monthly-income',authmiddleware,getMonthOrderIncome)
// router.get('/admin/monthly-count',authmiddleware,getMonthOrderCount)
router.get('/admin/yearly-income',authmiddleware,getYearlyOrderIncome)
router.get('/my/orders',authmiddleware,getMyOrder);
router.get('/all/orders',authmiddleware,getAllOrders);
module.exports = router;
