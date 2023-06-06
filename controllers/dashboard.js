const User = require('../models/userdetails');
const Expenses = require('../models/expensedetails');

var arr=[{}];
let array;
const showDashboard = async(req, res, next)=>{
    // console.log(req);
    
    try{
    
    
    const users = await User.findAll();
    const expenses = await Expenses.findAll();
        let userExpenses={}
    expenses.forEach(expense=>{
       
        if(userExpenses[expense.userId]){
            userExpenses[expense.userId]=userExpenses[expense.userId]+expense.amount;
        }
        else{
            userExpenses[expense.userId]=expense.amount;
        }
    })
    var leaderboard = []
    users.forEach(user=>{
        if(userExpenses[user.id]){
            leaderboard.push({name: user.username, totalExpense: userExpenses[user.id]});
        }
        else{
            leaderboard.push({name: user.username, totalExpense: 0});
        }
        
    })
    leaderboard.sort((a, b) => b.totalExpense-a.totalExpense);
    res.status(200).json(leaderboard);
    // console.log(users);
    // array = users.forEach(async(user) => {
    //     let sum=0;
    //     const expenses =await Expenses.findAll({where:{userId: user.id}});
    //     // console.log(expenses);
    //     expenses.forEach(expense=>{
    //         sum=sum+expense.amount;
    //     })
    //     arr.push({id: user.id, name: user.username, totalexpense:sum});
    //     return arr;
    // }
    // );
    // console.log(array);
    // res.status(202).json({array: arr});
    }
    catch(err){
        console.log(err);
    }
}

module.exports={showDashboard};