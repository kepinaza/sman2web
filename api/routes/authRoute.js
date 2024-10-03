const {registerUser, loginUser, Me, logOut} = require('../controllers/authController');
const {verifyUser, verifyToken} = require('../middlewares/AuthUser');
const express = require('express');

const router = express.Router();

//AUTHENTICATION ROUTER
router.post('/register', registerUser);
router.post('/login', loginUser);
router.delete('/logout', logOut);
router.get('/me', verifyUser, verifyToken, Me);

module.exports = router;
