require('dotenv').config();
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('library_development', 'tendwa', process.env.DB_PASS, {
    host: 'localhost',
    dialect: 'postgres',
});

module.exports = sequelize;