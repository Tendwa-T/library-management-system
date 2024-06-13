const express = require('express');
const { createAuthor, getAllAuthors, getAuthorById, updateAuthor, deleteAuthor } = require('../controllers/author');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

router.post('/create', verifyToken, createAuthor);
router.get('/', getAllAuthors);
router.get('/:id', getAuthorById);
router.put('/:id', verifyToken, updateAuthor);
router.delete('/:id', verifyToken, deleteAuthor);

module.exports = router;