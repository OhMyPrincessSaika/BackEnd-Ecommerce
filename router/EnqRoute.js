const express = require('express');

const {createEnquiry,getEnquiry,getEnquiries,updateEnquiry,deleteEnquiry} = require('../controllers/EnqCtrl');

const {authmiddleware,adminmiddleware} = require('../middlewares/authmiddleware');
const router = express.Router();

router.post('/',createEnquiry);
router.get('/',getEnquiries);
router.get('/:id',getEnquiry);
router.patch("/:id",authmiddleware,adminmiddleware,updateEnquiry);
router.delete('/:id',authmiddleware,adminmiddleware,deleteEnquiry);


module.exports = router;