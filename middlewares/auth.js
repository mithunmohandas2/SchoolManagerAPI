const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const verifyToken = async (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["authorization"];

    if (!token) {
        // (Unauthorized)
        return res.status(401).json({ error: 'Unauthorized Access' });
    }

    // Remove "Bearer " from the token if it is in Authorization header
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    try {
        const decoded = jwt.verify(token, process.env.secretJWT ?? "success2025");
        req.user = decoded;  
        return next(); 
    } catch (error) {
        // If token is invalid or expired
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

module.exports = {
    verifyToken
};
