const Expense = require('../models/expensedetails');

exports.getExpenses = async (req, res, next)=>{
    try{
       let expenses = await Expense.findAll()
    res.status(200).json({allExpenses: expenses});
    }
    
    catch(err){
        console.log(err);
    }
};

exports.postExpense = async (req, res, next) => {
    // console.log(req);
    let amt =  req.body.amt;
    let desc = req.body.des;
    let category = req.body.cg;
    // console.log(name);
    try{
        let expense =await Expense.create({
            amount: amt,
            description: desc,
            category: category
          })
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