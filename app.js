const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');

const sequelize = require('./util/database');

const User = require('./models/userdetails');
const Expense = require('./models/expensedetails');
const Order = require('./models/order');
const ForgotPassword = require('./models/forgotpassword');
const File = require('./models/filehistory');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const userRoutes = require('./routes/routes');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags:'a'});

app.use(helmet());
app.use(morgan('combined', {stream: accessLogStream}));

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

User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User);

User.hasMany(File);
File.belongsTo(User);

sequelize.sync()
.then(result=>{
    // console.log(result);
    app.listen(8000);
    
}).catch(err=>{
    console.log(err);
})

