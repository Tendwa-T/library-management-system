const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Loan = require('./loan');

const Member = sequelize.define('Member',
    {
        memberID: {
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
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }
);


module.exports = Member;
