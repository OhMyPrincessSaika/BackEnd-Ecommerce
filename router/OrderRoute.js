const express = require('express');
const router = express.Router();
const {authmiddleware} = require('../middlewares/authmiddleware');
const {createOrder ,getOrdersByUserId,getOrders} = require('../controllers/Order-Controller');
router.post('/',authmiddleware,createOrder);
router.get('/:id',authmiddleware,getOrdersByUserId);
router.get('/',authmiddleware,getOrders)
module.exports = router;