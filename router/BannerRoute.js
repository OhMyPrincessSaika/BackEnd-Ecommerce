const {getAllBanners,updateBanner,createBanner,deleteBanner, getBanner} = require('../controllers/Banner-Controller')
const express = require('express');
const router = express.Router();

router.route('/').post(createBanner).get(getAllBanners);
router.route('/:id').patch(updateBanner).delete(deleteBanner).get(getBanner);


module.exports = router;