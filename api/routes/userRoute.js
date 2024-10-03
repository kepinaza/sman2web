const {getPost} = require('../controllers/user/userController');
const express = require('express');

const router = express.Router();

//NON USER/LOGIN ROUTER
router.get('/getPost', getPost);

module.exports = router;