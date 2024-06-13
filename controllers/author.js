const { Author } = require('../models/index');
const logger = require('../utils/logger');

const nameRegex = /^[a-zA-Z0-9]+$/;

const createAuthor = async (req, res) => {
    const { firstName, lastName } = req.body;
    const { username, isAdmin } = req.user;

    if (!isAdmin) {
        logger.warn(`Unauthorized attempt to create author by ${username}`);
        return res.status(403).json({ data: {}, message: 'Unauthorized', success: false });
    }

    if (!firstName || firstName === '' || !lastName || lastName === '') {
        return res.status(400).json({ data: {}, message: 'All fields are required', success: false });
    }
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
        return res.status(400).json({ data: {}, message: 'Invalid name', success: false });
    }
    try {
        const existingAuthor = await Author.findOne({ where: { firstName, lastName } });
        if (existingAuthor) {
            return res.status(409).json({ data: {}, message: 'Author already exists', success: false });
        }
        const newAuthor = await Author.create({ firstName, lastName, authorID: 'AU-' + Math.floor(Math.random() * 10000) });
        return res.status(201).json({ data: newAuthor, message: 'Author created', success: true });
    }
    catch (error) {
        logger.error(error.message);
        return res.status(500).json({ data: {}, message: error.message, success: false });
    }
};

const getAllAuthors = async (req, res) => {
    try {
        const authors = await Author.findAll();
        if (authors.length === 0) {
            return res.status(404).json({ data: {}, message: 'No Authors found', success: false });
        }
        return res.status(200).json({ data: authors, message: 'Authors retrieved', success: true });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ data: {}, message: error.message, success: false });
    }
};

const getAuthorById = async (req, res) => {
    const { id } = req.params;
    try {
        const author = await Author.findOne({
            where: { authorID: id }
        });
        if (author) {
            return res.status(200).json({ data: author, message: 'Author found', success: true });
        }
        return res.status(404).json({ data: {}, message: 'Author with the specified ID does not exist', success: false });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ data: {}, message: error.message, success: false });
    }
}

const updateAuthor = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName } = req.body;

    if (!firstName || firstName === '' || !lastName || lastName === '') {
        return res.status(400).json({ data: {}, message: 'All fields are required', success: false });
    }
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
        return res.status(400).json({ data: {}, message: 'Invalid name', success: false });
    }

    try {
        const author = await Author.findOne({ where: { authorID: id } });
        if (!author) {
            return res.status(404).json({ data: {}, message: 'Author not found', success: false });
        }
        const updatedAuthor = await Author.update({ firstName, lastName }, {
            where: { authorID: id }
        });
        return res.status(200).json({ data: updatedAuthor, message: 'Author updated', success: true });
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ data: {}, message: error.message, success: false });
    }
};

const deleteAuthor = async (req, res) => {
    const { id } = req.params;
    const { username, isAdmin } = req.user;

    if (!isAdmin) {
        logger.warn(`Unauthorized attempt to delete author by ${username}`)
        return res.status(403).json({ data: {}, message: 'Unauthorized', success: false });
    }
    try {
        if (!await Author.findOne({ where: { authorID: id } })) {
            return res.status(404).json({ data: {}, message: 'Author not found', success: false });
        }

        const deleted = await Author.destroy({
            where: { authorID: id }
        });
        if (deleted) {
            logger.info(`Author with ID ${id} deleted by ${username}`);
            return res.status(202).json({ data: {}, message: 'Author deleted', success: true });
        }
    } catch (error) {
        logger.error(error.message);
        return res.status(500).json({ data: {}, message: error.message, success: false });
    }
};

module.exports = {
    createAuthor,
    getAllAuthors,
    getAuthorById,
    updateAuthor,
    deleteAuthor
};