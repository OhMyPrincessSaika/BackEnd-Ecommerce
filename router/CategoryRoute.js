const express = require('express');
const router = express.Router();
const {createCategory,getCategory,updateCategory,deleteCategory,getAllCategories} = require('../controllers/Category-Ctrl');


router.route('/').get(getAllCategories).post(createCategory);
router.route('/:id').get(getCategory).patch(updateCategory).delete(deleteCategory);

module.exports = router;