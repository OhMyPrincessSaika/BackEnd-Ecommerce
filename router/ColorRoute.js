const express = require('express');
const {createColor,getColor,getColors,updateColor,deleteColor} = require('../controllers/Color-Ctrl');
const router = express.Router();

router.route('/').post(createColor).get(getColors);
router.route('/:id').patch(updateColor).delete(deleteColor).get(getColor);


module.exports = router;