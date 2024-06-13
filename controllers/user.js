require('dotenv').config();
const { User } = require('../models/index');
const { generateToken } = require('../middleware/auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');


const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
const nameRegex = /^[a-zA-Z0-9]+$/;
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;


const createUser = async (req, res) => {

    const { firstName, lastName, email, username, password, isAdmin } = req.body;
    /*     const { username: adminUsername, isAdmin: adminIsAdmin } = req.user;
        if (!adminIsAdmin) {
            logger.error(`Unauthorized access request by ${adminUsername}`);
            return res.status(403).json({ data: {}, message: 'Unauthorized', success: false });
        } */

    if (!firstName || firstName === '' || !lastName || lastName === '' || !email || email === '' || !username || username === '' || !password || password === '') {
        return res.status(400).json({ data: {}, message: 'All fields are required', success: false });
    }
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
        return res.status(400).json({ data: {}, message: 'Invalid name', success: false });
    }
    if (!usernameRegex.test(username)) {
        return res.status(400).json({ data: {}, message: 'Invalid username', success: false });
    }
    if (!emailRegex.test(email)) {
        return res.status(400).json({ data: {}, message: 'Invalid email', success: false });
    }
    try {
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(409).json({ data: {}, message: 'User already exists', success: false });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ firstName, lastName, email, username, password: hashedPassword, isAdmin });
        const userData = { username: newUser.username, email: newUser.email, isAdmin: newUser.isAdmin };
        logger.info(`User ${newUser.username} created`);
        return res.status(201).json({ data: userData, message: 'User created', success: true });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ data: {}, message: error.message, success: false });
    }
};

const getAllUsers = async (req, res) => {
    const { username, isAdmin } = req.user;
    if (!isAdmin) {
        logger.error(`Unauthorized access request by ${username}`);
        return res.status(403).json({ data: {}, message: 'Unauthorized', success: false });
    }
    try {
        const users = await User.findAll({ attributes: { exclude: ['password'] } });
        if (users.length === 0) {
            return res.status(404).json({ data: {}, message: 'No Users found', success: false });
        }
        return res.status(200).json({ data: users, message: 'Users retrieved', success: true });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ data: {}, message: error.message, success: false });
    }
};

const getUserByUsername = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findOne({
            where: { username: id }
        });
        if (user) {
            return res.status(200).json({ data: user, message: 'User found', success: true });
        }
        return res.status(404).json({ data: {}, message: 'User with the specified ID does not exist', success: false });
    }
    catch (error) {
        logger.error(error.message);
        return res.status(500).json({ data: {}, message: error.message, success: false });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, email, username, password } = req.body;
    if (!firstName || firstName === '' || !lastName || lastName === '' || !email || email === '' || !username || username === '' || !password || password === '') {
        return res.status(400).json({ data: {}, message: 'All fields are required', success: false });
    }
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
        return res.status(400).json({ data: {}, message: 'Invalid name', success: false });
    }
    if (!usernameRegex.test(username)) {
        return res.status(400).json({ data: {}, message: 'Invalid username', success: false });
    }
    try {
        const user = await User.findOne({ where: { username: id } });
        if (!user) {
            return res.status(404).json({ data: {}, message: 'User with the specified ID does not exist', success: false });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.update({ firstName, lastName, email, username, password: hashedPassword }, { where: { username: id } });
        logger.info(`User ${user.username} updated`);
        return res.status(200).json({ data: {}, message: 'User updated', success: true });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ data: {}, message: error.message, success: false });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    const { username, isAdmin } = req.user;

    if (!isAdmin) {
        logger.error(`Unauthorized delete request by ${username}`);
        return res.status(403).json({ data: {}, message: 'Unauthorized', success: false });
    }

    try {
        const user = await User.findOne({ where: { username: id } });
        if (!user) {
            return res.status(404).json({ data: {}, message: 'User with the specified ID does not exist', success: false });
        }
        await User.destroy({ where: { username: id } });
        logger.info(`User ${user.username} deleted`);
        return res.status(200).json({ data: {}, message: 'User deleted', success: true });
    }
    catch (error) {
        logger.error(error.message);
        return res.status(500).json({ data: {}, message: error.message, success: false });
    }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    if (!username || username === '' || !password || password === '') {
        return res.status(400).json({ data: {}, message: 'All fields are required', success: false });
    }
    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ data: {}, message: 'User not found', success: false });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ data: {}, message: 'Invalid password', success: false });
        }
        const token = generateToken(user);
        logger.info(`User ${user.username} logged in`);
        return res.status(200).json({ data: { username: user.username, isAdmin: user.isAdmin, token }, message: 'Login successful', success: true });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ data: {}, message: error.message, success: false });
    }
};

const logoutUser = async (req, res) => {
    const { username } = req.body;
    if (!username || username === '') {
        return res.status(400).json({ data: {}, message: 'Username is required', success: false });
    }
    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ data: {}, message: 'User not found', success: false });
        }
        const token = jwt.sign({ username: user.username, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: 1 });
        logger.info(`User ${user.username} logged out`);
        return res.status(200).json({ data: { username: user.username, isAdmin: user.isAdmin, token }, message: 'Logout successful', success: true });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ data: {}, message: error.message, success: false });
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserByUsername,
    updateUser,
    deleteUser,
    loginUser,
    logoutUser,
}