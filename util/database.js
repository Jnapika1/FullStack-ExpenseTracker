const Sequelize = require('sequelize');

const sequelize= new Sequelize('expense', 'root', 'Stark@1903', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;