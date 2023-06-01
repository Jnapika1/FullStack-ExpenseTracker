const path = require('path');
const cors = require('cors');

const express = require('express');
const bodyParser = require('body-parser');

const sequelize = require('./util/database');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const userRoutes = require('./routes/routes');

app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.use(userRoutes);

sequelize.sync()
.then(result=>{
    // console.log(result);
    app.listen(8000);
    
}).catch(err=>{
    console.log(err);
})

