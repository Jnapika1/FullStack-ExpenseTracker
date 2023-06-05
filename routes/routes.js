const path = require('path');
const express = require('express');

const router = express.Router();

const userController = require('../controllers/signup');
const loginController = require('../controllers/login');
const expenseController = require('../controllers/expenses');
const userAuthentication = require('../middleware/auth');
const purchaseController = require('../controllers/purchase')

router.post('/user/signup', userController.postSignupUser);

router.post('/user/login', loginController.postUserLogin);

router.get('/expense/getexpense', userAuthentication.authenticate, expenseController.getExpenses );

router.post('/expense/addexpense', userAuthentication.authenticate, expenseController.postExpense);

router.delete('/expense/deleteexpense/:id', expenseController.deleteExpense);

router.get('/purchase/premiummembership', userAuthentication.authenticate, purchaseController.purchasepremium);
router.post('/purchase/updatetransactionstatus', userAuthentication.authenticate, purchaseController.updateTransaction);
router.post('/purchase/failedtransaction', userAuthentication.authenticate, purchaseController.failedTransaction);

module.exports=router;