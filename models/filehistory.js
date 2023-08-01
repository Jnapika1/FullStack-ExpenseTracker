const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const File = sequelize.define('file', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
    url: Sequelize.STRING,
    date: Sequelize.DATE
})

module.exports = File;