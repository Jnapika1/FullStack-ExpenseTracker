const User = require('../models/userdetails');

exports.postUserLogin = async (req, res, next)=>{
    const email = req.body.email;
    const password = req.body.password;
    const emailExists = await User.findOne({where: {email:email}});
    // console.log(emailExists);
    
    if(emailExists!=null){
        const checkPassword =await User.findOne({where: {email:email, password:password}});
        if(checkPassword!=null){
            res.status(201).json({success : true, message: 'User logged in successfully!'});
        }
        else{
            res.status(401).json({success:false, message: 'Incorrect Password!'})
        }
    }
    else{
        res.status(404).json({success : false, message: 'User not found!'});
    }
}