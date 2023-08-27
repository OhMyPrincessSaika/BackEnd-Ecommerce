const express = require('express');
const { createCatBanner, getAllCatBanners, updateCatBanner, deleteCatBanner, getCatBanner } = require('../controllers/Banner_Cat_Ctrl');

const router = express.Router();

router.route('/').post(createCatBanner).get(getAllCatBanners);
router.route('/:id').patch(updateCatBanner).delete(deleteCatBanner).get(getCatBanner);

module.exports = router;