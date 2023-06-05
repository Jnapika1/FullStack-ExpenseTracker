const path = require('path');
const cors = require('cors');

const express = require('express');
const bodyParser = require('body-parser');

const sequelize = require('./util/database');

const User = require('./models/userdetails');
const Expense = require('./models/expensedetails');
const Order = require('./models/order');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const userRoutes = require('./routes/routes');

app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.use(userRoutes);

User.hasMany(Expense);
Expense.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE'
})

User.hasMany(Order);
Order.belongsTo(User);

sequelize.sync()
.then(result=>{
    // console.log(result);
    app.listen(8000);
    
}).catch(err=>{
    console.log(err);
})

