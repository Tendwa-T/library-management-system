const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Book = require('./book');
const Member = require('./member');


const Loan = sequelize.define('Loan',
  {
    loanID: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    isbn: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Books',
        key: 'isbn',
      },
    },
    memberID: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Members',
        key: 'memberID',
      },
    },
    loanDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    returned: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    returnedDate: {
      type: DataTypes.DATE,
    },
  }
);


module.exports = Loan;