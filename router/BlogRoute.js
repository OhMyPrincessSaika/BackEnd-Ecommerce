const express = require('express');
const { createBlog,getBlog,updateBlog,deleteBlog,getAllBlogs } = require('../controllers/Blog-Ctrl');
const router = express.Router();

router.route('/').post(createBlog).get(getAllBlogs);
router.route('/:id').get(getBlog).patch(updateBlog).delete(deleteBlog);


module.exports = router;