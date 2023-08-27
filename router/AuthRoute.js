const express = require('express');
const router = express.Router();
const {login,register,adminRegister, adminLogin} = require('../controllers/Auth-Controller');
router.post('/login',login);
router.post('/admin-register',adminRegister)
router.post('/register',register);
router.post('/admin-login',adminLogin);

module.exports = router;