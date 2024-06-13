const Member = require('../models/member');
const logger = require('../utils/logger');

const nameRegex = /^[a-zA-Z0-9]+$/;


const createMember = async (req, res) => {
    const { firstName, lastName, email, phoneNumber } = req.body;
    if (!firstName || firstName === '' || !lastName || lastName === '' || !email || email === '' || !phoneNumber || phoneNumber === '') {
        return res.status(400).json({ data: {}, message: 'All fields are required', success: false });
    }
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
        return res.status(400).json({ data: {}, message: 'Invalid name', success: false });
    }
    try {
        const existingMember = await Member.findOne({ where: { email } });
        if (existingMember) {
            return res.status(409).json({ data: {}, message: 'Member already exists', success: false });
        }
        const newMember = await Member.create({ firstName, lastName, email, phoneNumber, memberID: 'MB' + Math.floor(Math.random() * 1000) });
        return res.status(201).json({ data: newMember, message: 'Member created', success: true });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ data: {}, message: error.message, success: false });
    }
};

const getAllMembers = async (req, res) => {
    try {
        const members = await Member.findAll();
        if (members.length === 0) {
            return res.status(404).json({ data: {}, message: 'No Members found', success: false });
        }
        return res.status(200).json({ data: members, message: 'Members retrieved', success: true });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ data: {}, message: error.message, success: false });
    }
};

const getMemberById = async (req, res) => {
    const { id } = req.params;
    try {
        const member = await Member.findOne({
            where: { memberID: id }
        });
        if (member) {
            return res.status(200).json({ data: member, message: 'Member found', success: true });
        }
        return res.status(404).json({ data: {}, message: 'Member with the specified ID does not exist', success: false });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ data: {}, message: error.message, success: false });
    }
};

const updateMember = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, email, phoneNumber } = req.body;

    if (!firstName || firstName === '' || !lastName || lastName === '' || !email || email === '' || !phoneNumber || phoneNumber === '') {
        return res.status(400).json({ data: {}, message: 'All fields are required', success: false });
    }
    try {
        const [updated] = await Member.update(req.body, {
            where: { memberID: id }
        });
        if (updated) {
            const updatedMember = await Member.findOne({ where: { memberID: id } });
            return res.status(200).json({ data: updatedMember, message: 'Member updated', success: true });
        }
        return res.status(404).json({ data: {}, message: 'Member with the specified ID does not exist', success: false });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ data: {}, message: error.message, success: false });
    }
};

const deleteMember = async (req, res) => {
    const { id } = req.params;
    const { username, isAdmin } = req.user;

    if (!isAdmin) {
        logger.error(`Unauthorized delete attempt by ${username}`);
        return res.status(403).json({ data: {}, message: 'Unauthorized', success: false });
    }

    try {
        const deleted = await Member.destroy({
            where: { memberID: id }
        });
        if (deleted) {
            return res.status(200).json({ data: {}, message: 'Member deleted', success: true });
        }
        return res.status(404).json({ data: {}, message: 'Member with the specified ID does not exist', success: false });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ data: {}, message: error.message, success: false });
    }
}

module.exports = {
    createMember,
    getAllMembers,
    getMemberById,
    updateMember,
    deleteMember,
};