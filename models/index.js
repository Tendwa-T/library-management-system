require('dotenv').config();
const Sequelize = require('sequelize');
const sequelize = require('../config/database');


Loan = require('./loan');
User = require('./user');
Book = require('./book');
Member = require('./member');
Author = require('./author');

Author.hasMany(Book, { foreignKey: 'authorID' });
Book.hasMany(Loan, { foreignKey: 'isbn' });
Loan.belongsTo(Book, { foreignKey: 'isbn' });
Loan.belongsTo(Member, { foreignKey: 'memberID' });
Member.hasMany(Loan, { foreignKey: 'memberID' });

module.exports = {
    Loan,
    User,
    Book,
    Member,
    Author,
    sequelize,
    Sequelize
}