const Expense = require('../models/expensedetails');
const User = require('../models/userdetails');
const File = require('../models/filehistory');
const sequelize = require('../util/database');
const S3Services = require('../services/s3services');
const UserServices = require('../services/userservices');


exports.downloadExpense = async(req, res)=>{
    try{
    const expenses =await UserServices.getExpenses(req);
    // console.log(expenses);
    const userId = req.user.id;
    const stringifyExpenses = JSON.stringify(expenses);
    const date = new Date();
    const filename= `Expense${userId}/${date}.txt`;
    const fileUrl =await S3Services.uploadToS3(stringifyExpenses, filename);
    await File.create({
        url: fileUrl,
        date: date,
        userId: userId
    })
    let filehistory = await File.findAll({where:{userId:req.user.id}});
    // console.log(filehistory);
    res.status(201).json({filehistory, success:true})
    }
    catch(err){
        console.log(err);
        res.status(500).json({filehistory:'', success: false, err:err});
    }
}

exports.getExpenses = async (req, res, next)=>{
    try{
        const rows =JSON.parse(req.header('rows'));
        console.log(rows);
        const page = +req.query.page || 1;
        let totalItems = await Expense.count({where:{userId:req.user.id}});
        let expenses = await Expense.findAll({
            where:{userId:req.user.id},
            offset: (page-1)*rows,
            limit:rows
            });
        res.status(200).json({
            expenses: expenses,
            currentPage: page,
            hasNextPage: rows*page<totalItems,
            nextPage: page+1,
            hasPreviousPage: page>1,
            previousPage: page-1,
            lastPage: Math.ceil(totalItems/rows),
            premiumUser: req.user.ispremium
        });
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