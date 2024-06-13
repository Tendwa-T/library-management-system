const Loan = require('../models/loan');
const Book = require('../models/book');
const Member = require('../models/member');
const logger = require('../utils/logger');

const createLoan = async (req, res) => {
    const { memberID, bookISBN } = req.body;
    if (!memberID || memberID === '' || !bookISBN || bookISBN === '') {
        return res.status(400).json({ data: {}, message: 'Member ID and Book ISBN are required', success: false });
    }
    try {
        const existingMember = await Member.findOne({ where: { memberID } });
        if (!existingMember) {
            return res.status(404).json({ data: {}, message: 'Member does not exist', success: false });
        }
        const existingBook = await Book.findOne({ where: { isbn: bookISBN } });
        if (!existingBook) {
            return res.status(404).json({ data: {}, message: 'Book does not exist', success: false });
        }
        if (existingBook.quantity === 0) {
            return res.status(409).json({ data: {}, message: 'Book is out of stock', success: false });
        }
        const existingLoan = await Loan.findOne({ where: { memberID, isbn: bookISBN } });
        if (existingLoan) {
            return res.status(409).json({ data: {}, message: 'Loan already exists', success: false });
        }
        const newLoan = await Loan.create({ memberID, isbn: bookISBN, loanID: 'LN' + Math.floor(Math.random() * 1000), loanDate: new Date().toISOString(), returned: false, returnedDate: null, dueDate: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString() });
        await Book.update({ quantity: existingBook.quantity - 1 }, { where: { isbn: bookISBN } });
        return res.status(201).json({ data: newLoan, message: 'Loan created', success: true });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ data: {}, message: error.message, success: false });
    }
};

const getAllLoans = async (req, res) => {
    try {
        const loans = await Loan.findAll();
        if (loans.length === 0) {
            return res.status(404).json({ data: {}, message: 'No Loans found', success: false });
        }
        return res.status(200).json({ data: loans, message: 'Loans retrieved', success: true });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ data: {}, message: error.message, success: false });
    }
};

const getLoanByMemberID = async (req, res) => {
    const { memberID } = req.params;
    if (!memberID || memberID === '') {
        return res.status(400).json({ data: {}, message: 'Member ID is required', success: false });
    }
    try {
        if (!await Member.findOne({ where: { memberID } })) {
            return res.status(404).json({ data: {}, message: 'Member does not exist', success: false });
        }
        const loans = await Loan.findAll({ where: { memberID } });
        if (loans.length === 0) {
            return res.status(404).json({ data: {}, message: 'No Loans found', success: false });
        }
        return res.status(200).json({ data: loans, message: 'Loans retrieved', success: true });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ data: {}, message: error.message, success: false });
    }
};

const getLoansByBookISBN = async (req, res) => {
    const { bookISBN } = req.params;
    if (!bookISBN || bookISBN === '') {
        return res.status(400).json({ data: {}, message: 'Book ISBN is required', success: false });
    }
    try {
        if (!await Book.findOne({ where: { isbn: bookISBN } })) {
            return res.status(404).json({ data: {}, message: 'Book does not exist', success: false });
        }
        const loans = await Loan.findAll({ where: { isbn: bookISBN } });
        if (loans.length === 0) {
            return res.status(404).json({ data: {}, message: 'No Loans found', success: false });
        }
        return res.status(200).json({ data: loans, message: 'Loans retrieved', success: true });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ data: {}, message: error.message, success: false });
    }
};

const returnBook = async (req, res) => {
    const { memberID, bookISBN } = req.body;
    if (!memberID || memberID === '' || !bookISBN || bookISBN === '') {
        return res.status(400).json({ data: {}, message: 'Member ID and Book ISBN are required', success: false });
    }
    try {
        const existingLoan = await Loan.findOne({ where: { memberID, isbn: bookISBN } });
        if (!existingLoan) {
            return res.status(404).json({ data: {}, message: 'Loan does not exist', success: false });
        }
        if (existingLoan.returned) {
            return res.status(409).json({ data: {}, message: 'Book has already been returned', success: false });
        }
        const updatedLoan = await Loan.update({ returned: true, returnedDate: new Date().toISOString() }, { where: { memberID, isbn: bookISBN } });
        const existingBook = await Book.findOne({ where: { isbn: bookISBN } });
        await Book.update({ quantity: existingBook.quantity + 1 }, { where: { isbn: bookISBN } });
        return res.status(200).json({ data: updatedLoan, message: 'Book returned', success: true });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ data: {}, message: error.message, success: false });
    }
};

const deleteLoan = async (req, res) => {
    const { memberID, bookISBN } = req.body;
    const { username, isAdmin } = req.user;

    if (!isAdmin) {
        logger.error(`Unauthorized access by ${username}`);
        return res.status(403).json({ data: {}, message: 'Unauthorized', success: false });
    }

    if (!memberID || memberID === '' || !bookISBN || bookISBN === '') {
        return res.status(400).json({ data: {}, message: 'Member ID and Book ISBN are required', success: false });
    }
    try {
        const existingLoan = await Loan.findOne({ where: { memberID, isbn: bookISBN } });
        if (!existingLoan) {
            return res.status(404).json({ data: {}, message: 'Loan does not exist', success: false });
        }
        const deletedLoan = await Loan.destroy({ where: { memberID, isbn: bookISBN } });
        logger.info(`Loan with Member ID ${memberID} and Book ISBN ${bookISBN} deleted by ${username}`);
        return res.status(200).json({ data: deletedLoan, message: 'Loan deleted', success: true });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ data: {}, message: error.message, success: false });
    }
}

module.exports = {
    createLoan,
    getAllLoans,
    getLoanByMemberID,
    getLoansByBookISBN,
    returnBook,
    deleteLoan,
};