const express = require('express');
const router = express.Router();
const {uploadProductImages,deleteProductImages} = require('../controllers/UploadCtrl');
const {authmiddleware} = require('../middlewares/authmiddleware');
const {uploadImage,resizeImage} = require('../middlewares/uploadImage');

// router.route('/uploadImages').post(authmiddleware,uploadImage.array("images",10),resizeImage,uploadProductImages)
router.route('/uploadImages').post(authmiddleware,uploadImage.array('images',10),uploadProductImages)
router.route('/delete-img/:id').delete(deleteProductImages)

module.exports = router;