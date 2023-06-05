const Razorpay = require('razorpay');
const Order = require('../models/order');
require('dotenv').config();


const purchasepremium = async(req, res)=>{
    console.log(req);
    try{
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount = 2500;
        rzp.orders.create({amount, currency: "INR"}, (err, order)=>{
            if(err){
                throw new Error(JSON.stringify(err));
            }
            req.user.createOrder({orderid: order.id, status: 'PENDING'}).then(()=>{
                return res.status(201).json({order, key_id: rzp.key_id});
            })
            .catch(err=>{
                throw new Error(err);
            })
        })
    }
    catch(err){
        console.log(err);
        res.status(403).json({message: 'Something went wrong', error: err});
    }
}

const updateTransaction = async(req, res)=>{
    try{
        const{payment_id, order_id} = req.body;
        const order = await Order.findOne({where: {orderid: order_id}});
        await order.update({paymentid: payment_id, status: 'SUCCESSFUL'});
        await req.user.update({ispremium: true});
        res.status(202).json({success: true, message: "Transcation Successful"});


        // Order.findOne({where: {orderid: order_id}}).then(order=>{
        //     order.update({paymentid: payment_id, status: 'SUCCESSFUL'}).then(()=>{
        //         req.user.update({ispremium: true}).then(()=>{
        //             return res.status(202).json({success: true, message: "Transcation Successful"});
        //     }).catch(err=>{
        //         throw new Error(err);
        //         })
        //      }).catch(err=>{
        //             throw new Error(err);
        //      })
        // }).catch(err=>{
        //     throw new Error(err);
        //     })

}
catch(err){
    console.log(err);
        res.status(403).json({message: 'Something went wrong', error: err});
}
}

const failedTransaction = async(req, res)=>{
    try{
        const{payment_id, order_id} = req.body;
        const order = await Order.findOne({where: {orderid: order_id}});
        await order.update({paymentid: payment_id, status: 'FAILED'});
        res.status(202).json({success: false, message: "Transcation Failed"});
    }
    catch(err){
        console.log(err);
        res.status(403).json({message: 'Something went wrong', error: err});
    }
}

module.exports= {
    purchasepremium, updateTransaction, failedTransaction
}