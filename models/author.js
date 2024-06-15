const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Author = sequelize.define('Author',
  {
    authorID: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },

);

module.exports = Author;