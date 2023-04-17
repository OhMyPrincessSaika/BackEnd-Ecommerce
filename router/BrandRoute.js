const express = require('express');
const {createBrand,updateBrand,getBrand,getAllBrands,deleteBrand} = require('../controllers/Brand-Ctrl.js')
const router = express.Router();


router.route('/').post(createBrand).get(getAllBrands);
router.route('/:id').get(getBrand).patch(updateBrand).delete(deleteBrand);

module.exports = router;