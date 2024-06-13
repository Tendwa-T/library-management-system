require('dotenv').config();
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

const generateToken = (user) => {
    return jwt.sign({ username: user.username, isAdmin: user.isAdmin }, secretKey, { expiresIn: '1h' });
}

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ data: {}, message: 'Token is required', success: false });
    }
    jwt.verify(token, secretKey, (error, decoded) => {
        if (error) {
            return res.status(401).json({ data: {}, message: 'Invalid token', success: false });
        }
        req.user = decoded;
        next();
    });
}


module.exports = {
    generateToken,
    verifyToken,
};