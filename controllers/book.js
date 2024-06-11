const Book = require('../models/book');
const Author = require('../models/author');

const createBook = async (req, res) => {
    const { title, authorID, isbn, publishedDate } = req.body;
    if (!title || title === '' || !authorID || authorID === '' || !isbn || isbn === '' || !publishedDate || publishedDate === '') {
        return res.status(400).json({ data: {}, message: 'All fields are required', success: false });
    }

    const author = await Author.findOne({ where: { authorID } });
    if (!author) {
        return res.status(404).json({ data: {}, message: `Author with the authorID: ${authorID} does not exist`, success: false });
    }

    try {
        const existingBook = await Book.findOne({ where: { isbn } });
        if (existingBook) {
            return res.status(409).json({ data: {}, message: 'Book already exists', success: false });
        }
        const newBook = await Book.create({ title, authorID, isbn, publishedDate });
        return res.status(201).json({ data: newBook, message: 'Book created', success: true });
    } catch (error) {
        return res.status(500).json({ data: {}, message: error.message, success: false });
    }
};

const getAllBooks = async (req, res) => {
    try {
        const books = await Book.findAll();
        if (books.length === 0) {
            return res.status(404).json({ data: {}, message: 'No Books found', success: false });
        }
        return res.status(200).json({ data: books, message: 'Books retrieved', success: true });
    } catch (error) {
        return res.status(500).json({ data: {}, message: error.message, success: false });
    }
};

const getBookByIsbn = async (req, res) => {
    const { isbn } = req.params;
    try {
        const book = await Book.findOne({
            where: { isbn }
        });
        if (book) {
            return res.status(200).json({ data: book, message: 'Book found', success: true });
        }
        return res.status(404).json({ data: {}, message: 'Book with the specified ISBN does not exist', success: false });
    }
    catch (error) {
        return res.status(500).json({ data: {}, message: error.message, success: false });
    }
};

const updateBook = async (req, res) => {
    const { isbn } = req.params;
    const { title, authorID, publishedDate } = req.body;

    if (!title || title === '' || !authorID || authorID === '' || !publishedDate || publishedDate === '') {
        return res.status(400).json({ data: {}, message: 'All fields are required', success: false });
    }

    try {
        const [updated] = await Book.update(req.body, {
            where: { isbn }
        });
        if (updated) {
            const updatedBook = await Book.findOne({ where: { isbn } });
            return res.status(200).json({ data: updatedBook, message: 'Book updated', success: true });
        }
        return res.status(404).json({ data: {}, message: 'Book with the specified ISBN does not exist', success: false });
    } catch (error) {
        return res.status(500).json({ data: {}, message: error.message, success: false });
    }
};

const deleteBook = async (req, res) => {
    const { isbn } = req.params;
    try {
        const deleted = await Book.destroy({
            where: { isbn }
        });
        if (deleted) {
            return res.status(200).json({ data: {}, message: 'Book deleted', success: true });
        }
        return res.status(404).json({ data: {}, message: 'Book with the specified ISBN does not exist', success: false });
    } catch (error) {
        return res.status(500).json({ data: {}, message: error.message, success: false });
    }
};

module.exports = {
    createBook,
    getAllBooks,
    getBookByIsbn,
    updateBook,
    deleteBook,
};