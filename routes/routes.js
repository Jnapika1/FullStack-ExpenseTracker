const path = require('path');
const express = require('express');

const router = express.Router();

const userController = require('../controllers/signup');

router.post('/user/signup', userController.postSignupUser);

router.post('/user/login', (req, res, next)=>{
    console.log(req);
})

module.exports=router;