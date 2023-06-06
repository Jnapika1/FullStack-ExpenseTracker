const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');

const User = require('../models/userdetails');
const { GetEmailCampaign } = require('sib-api-v3-sdk');
// const Forgotpassword = require('../models/forgotpassword');

const forgotpassword = async (req, res) => {
    try {
        // console.log(req);
        const { email } =  req.body;
        const user = await User.findOne({where : { email }});
        if(user){
            // const id = uuid.v4();
            // user.createForgotpassword({ id , active: true })
            //     .catch(err => {
            //         throw new Error(err)
            //     })

            sgMail.setApiKey(process.env.SENGRID_API_KEY)

            const msg = {
                to: email, // Change to your recipient
                from: 'aishwarya200499@gmail.com', // Change to your verified sender
                subject: 'Sending with SendGrid is Fun',
                text: 'and easy to do anywhere, even with Node.js',
                html: '<h1>Email Reset</h1>',
            }

            sgMail
            .send(msg)
            .then((response) => {

                // console.log(response[0].statusCode)
                // console.log(response[0].headers)
                return res.status(response[0].statusCode).json({message: 'Link to reset password sent to your mail ', sucess: true})

            })
            .catch((error) => {
                throw new Error(error);
            })

            //send mail
        }else {
            throw new Error('User doesnt exist')
        }
    } catch(err){
        console.error(err)
        return res.json({ message: err, sucess: false });
    }

}

module.exports={
    forgotpassword
}