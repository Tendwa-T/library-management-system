const express = require('express');
const { createLoan, getAllLoans, getLoanByMemberID, getLoansByBookISBN, getLoanTableSummary, returnBook, deleteLoan } = require('../controllers/loan');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

router.post('/create', verifyToken, createLoan);
router.get('/', getAllLoans);
router.get('/summary', getLoanTableSummary);
router.get('/member/:memberID', getLoanByMemberID);
router.get('/book/:bookISBN', getLoansByBookISBN);
router.put('/return', verifyToken, returnBook);
router.delete('/', verifyToken, deleteLoan);

module.exports = router;