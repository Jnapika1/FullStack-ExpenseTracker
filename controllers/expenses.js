const Expense = require('../models/expensedetails');
const User = require('../models/userdetails');


exports.getExpenses = async (req, res, next)=>{
    try{
       let expenses = await Expense.findAll({where:{userId:req.user.id}})
     res.status(200).json({allExpenses: expenses, premiumUser: req.user.ispremium});
    }
    
    catch(err){
        console.log(err);
    }
};

exports.postExpense = async (req, res, next) => {
    // console.log(req.user);
    let amt =  req.body.amt;
    let desc = req.body.des;
    let category = req.body.cg;
    const user = User.findByPk(req.user.id);
    // console.log(name);
    try{
        let expense =await Expense.create({
            amount: amt,
            description: desc,
            category: category,
            userId : req.user.id,
            
          })
          await req.user.update({totalExpense: req.user.totalExpense+JSON.parse(amt)});
          res.status(201).json({newExpense: expense});
    }
    catch(err){
        console.log(err);
    }
  };

  exports.deleteExpense = async (req, res, next)=>{
      const id = req.params.id;
    //   console.log(id);
    try{
        let expense = await Expense.findByPk(id)
        expense.destroy();
        res.redirect('/');
     }
     
     catch(err){
         console.log(err);
     }
  }