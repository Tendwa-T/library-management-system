const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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

Loan.associations = (models) => {
  Loan.belongsTo(models.Member, {
    foreignKey: 'memberID',
  });
  Loan.belongsTo(models.Book, {
    foreignKey: 'isbn',
  });
}

Loan.sync({ alter: true });

module.exports = Loan;