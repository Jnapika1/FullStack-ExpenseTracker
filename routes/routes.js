const path = require('path');
const express = require('express');

const router = express.Router();

const userController = require('../controllers/signup');
const loginController = require('../controllers/login');
const expenseController = require('../controllers/expenses');

router.post('/user/signup', userController.postSignupUser);

router.post('/user/login', loginController.postUserLogin);

router.get('/expense/getexpense', expenseController.getExpenses );

router.post('/expense/addexpense', expenseController.postExpense);

router.delete('/expense/deleteexpense/:id', expenseController.deleteExpense);

module.exports=router;