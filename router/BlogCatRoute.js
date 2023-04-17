const express = require('express');
const{createBlogCategory,getBlogCategory,updateBlogCategory,deleteBlogCategory,getAllBlogCategories} = require('../controllers/BlogCatCtrl');
const router = express.Router();

router.route('/').post(createBlogCategory).get(getAllBlogCategories);
router.route('/:id').get(getBlogCategory).patch(updateBlogCategory).delete(deleteBlogCategory);


module.exports = router;