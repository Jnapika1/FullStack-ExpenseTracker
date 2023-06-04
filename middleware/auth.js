const jwt = require('jsonwebtoken');
const User = require('../models/userdetails');

const authenticate = (req, res, next)=>{
    try{
        const token = req.header('Authorization');
        // console.log(token);
        const user = jwt.verify(token, '9a4i9s3h3w5a8r2y6a3j77n29a0p7i1k5a01');
        // console.log('userId=>', user.userId);
        User.findByPk(user.userId).then(user=>{
            req.user = user;
            // console.log(req.user);
            next();
        })
    }
    catch(err){
        res.status(401).json({success: false});
    }
}

module.exports={authenticate};