const express = require('express');
const { createUser, getAllUsers, getUserByUsername, updateUser, deleteUser, loginUser, logoutUser } = require('../controllers/user');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

router.post('/create', createUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/', verifyToken, getAllUsers);
router.get('/:id', verifyToken, getUserByUsername);
router.put('/:id', verifyToken, updateUser);
router.delete('/:id', verifyToken, deleteUser);


module.exports = router;