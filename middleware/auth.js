// middleware/auth.js
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    // Extract token from the Authorization header
    if (!token) {
        return res.status(401).json({ message: 'Access denied, no token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        req.user = { userId: decoded.userId }; // Attach user info to the request
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = { authenticate };