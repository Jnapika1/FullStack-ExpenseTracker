const User = require('../models/userdetails');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function generateAccessToken(id){
    return jwt.sign({userId: id}, '9a4i9s3h3w5a8r2y6a3j77n29a0p7i1k5a01')
}

exports.postUserLogin = async (req, res, next)=>{
    const email = req.body.email;
    const password = req.body.password;
    
    // console.log(emailExists);
    try{
        const emailExists = await User.findOne({where: {email:email}});
        if(emailExists!=null){
            bcrypt.compare(password, emailExists.password, (err, result)=>{
                if(err){
                    throw new Error('Something went wrong');
                }
                if(result===true){
                    res.status(201).json({success : true, message: 'User logged in successfully!', token: generateAccessToken(emailExists.id)});
                    // res.redirect('../views/expense.html');
                }
                else{
                    res.status(401).json({success:false, message: 'Incorrect Password!'});
                }
            })
        }
        else{
            res.status(404).json({success : false, message: 'User not found!'});
        }
    }
    catch(err){
        res.status(500).json({success: false, message: err});
    }
    
}