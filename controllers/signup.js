const User = require('../models/userdetails');
exports.postSignupUser = async (req, res, next)=>{
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    let users = User.findAll();

    try{
        let user =await User.create({
            username: username,
            email: email,
            password: password
          })
          res.status(201).json({newUSer: user});
    }
    catch(err){
        // console.log(err);
        res.status(403).send({message: 'Error: user already exists!!'});
    }
}

