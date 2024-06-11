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
  });

Book.associations = (models) => {
  Book.belongsTo(models.Author, {
    foreignKey: 'author',
  });
}

Book.sync({ alter: true });

module.exports = Book;