
const Author = require('../models/author');

const createAuthor = async (req, res) => {
    const { name } = req.body;
    try {
        const existingAuthor = await Author.findOne({ where: { name } });
        if (existingAuthor) {
            return res.status(409).json({ data: {}, message: 'Author already exists', success: false });
        }
        const newAuthor = await Author.create({ name, authorID: 'AU' + Math.floor(Math.random() * 1000) });
        return res.status(201).json({ data: newAuthor, message: 'Author created', success: true });
    } catch (error) {

        return res.status(500).json({ data: {}, message: error.message, success: false });
    }
};

const getAllAuthors = async (req, res) => {
    try {
        const authors = await Author.findAll();
        return res.status(200).json({ data: authors, message: 'Authors retrieved', success: true });
    } catch (error) {
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
        return res.status(500).json({ data: {}, message: error.message, success: false });
    }
}

const updateAuthor = async (req, res) => {
    const { id } = req.params;
    try {
        const [updated] = await Author.update(req.body, {
            where: { authorID: id }
        });
        if (updated) {
            const updatedAuthor = await Author.findOne({ where: { authorID: id } });
            return res.status(200).json({ data: updatedAuthor, message: 'Author updated', success: true });
        }
        throw new Error('Author not found');
    } catch (error) {
        return res.status(500).json({ data: {}, message: error.message, success: false });
    }
};

const deleteAuthor = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Author.destroy({
            where: { authorID: id }
        });
        if (deleted) {
            return res.status(202).json({ data: {}, message: 'Author deleted', success: true });
        }
        throw new Error("Author not found");
    } catch (error) {
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