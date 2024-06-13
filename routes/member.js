const express = require('express');
const { createMember, getAllMembers, getMemberById, updateMember, deleteMember } = require('../controllers/member');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

router.post('/create', verifyToken, createMember);
router.get('/', verifyToken, getAllMembers);
router.get('/:id', verifyToken, getMemberById);
router.put('/:id', verifyToken, updateMember);
router.delete('/:id', verifyToken, deleteMember);

module.exports = router;