const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');

const express = require('express');

const app = express();
const dotenv = require('dotenv');
dotenv.config();

const bodyParser = require('body-parser');

const sequelize = require('./util/database');

const User = require('./models/userdetails');
const Expense = require('./models/expensedetails');
const Order = require('./models/order');
const ForgotPassword = require('./models/forgotpassword');
const File = require('./models/filehistory');



app.set('view engine', 'ejs');
app.set('views', 'views');

const userRoutes = require('./routes/routes');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags:'a'});

//app.use(helmet());
app.use(morgan('combined', {stream: accessLogStream}));

app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'views')));

app.use(cors());

app.use(userRoutes);

app.use((req, res)=>{
    console.log('url', req.url);
	res.setHeader("Content-Security-Policy-Report-Only", "default-src 'self' script-src 'self'; img-src 'self'; style-src 'self';base-uri 'self';form-action 'self'");
    res.sendFile(path.join(__dirname, `views/${req.url}`));
})

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

