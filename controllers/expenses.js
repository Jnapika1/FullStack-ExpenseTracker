const Expense = require('../models/expensedetails');
const User = require('../models/userdetails');
const sequelize = require('../util/database');


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
    // const user = User.findByPk(req.user.id);
    // console.log(name);
    const t = await sequelize.transaction();
    try{   
        let expense =await Expense.create({
            amount: amt,
            description: desc,
            category: category,
            userId : req.user.id
          }, {transaction: t})
        await User.update({totalExpense: req.user.totalExpense+JSON.parse(amt)}, {
              where:{id:req.user.id},
              transaction:t
            });
        await t.commit();
        res.status(201).json({newExpense: expense});
    }
    catch(err){
        await t.rollback();
        console.log(err);
        res.status(500).json({success:false, error:err})
    }
  };

  exports.deleteExpense = async (req, res)=>{
      const id = req.params.id;
      const t = await sequelize.transaction();
    //   console.log(id);
    try{
        let expense = await Expense.findOne({
            where: {id:id},
            transaction:t
        })
        // console.log(expense);
        User.update({totalExpense: req.user.totalExpense-expense.amount},{
            where:{id:req.user.id},
            transaction:t
        })
        await expense.destroy();
        await t.commit();
        res.status(200).json({success:true, message: 'Expense deleted successfully!'})
     }
     
     catch(err){
         await t.rollback();
         console.log(err);
     }
  }