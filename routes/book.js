const express = require('express');
const { createBook, getAllBooks, getBookByIsbn, updateBook, deleteBook } = require('../controllers/book');
const router = express.Router();

router.post('/create', createBook);
router.get('/', getAllBooks);
router.get('/:isbn', getBookByIsbn);
router.put('/:isbn', updateBook);
router.delete('/:isbn', deleteBook);

module.exports = router;