const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Author = sequelize.define('Author',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    authorID: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
  },

);
Author.sync({ alter: true });

module.exports = Author;