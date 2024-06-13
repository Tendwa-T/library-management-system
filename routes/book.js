const express = require('express');
const { createBook, getAllBooks, getBookByIsbn, updateBook, deleteBook } = require('../controllers/book');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

router.post('/create', verifyToken, createBook);
router.get('/', getAllBooks);
router.get('/:isbn', getBookByIsbn);
router.put('/:isbn', verifyToken, updateBook);
router.delete('/:isbn', verifyToken, deleteBook);

module.exports = router;