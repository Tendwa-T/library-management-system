const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Book = sequelize.define('Book',
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    authorID: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Authors',
        key: 'authorID',
      },
    },
    isbn: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    publishedDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

Book.associations = (models) => {
  Book.belongsTo(models.Author, {
    foreignKey: 'author',
  });
  Book.hasMany(models.Loan, {
    foreignKey: 'isbn',
  });
}

Book.sync({ alter: true, });

module.exports = Book;