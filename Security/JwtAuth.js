

const jwt = require('jsonwebtoken');
require('dotenv').config();

// Use JWT_SECRET for customer tokens, fallback to ACCESS_TOKEN for legacy tokens
const JWT_SECRET = process.env.JWT_SECRET || process.env.ACCESS_TOKEN || 'secret';


// Store/Admin token middleware (uses ACCESS_TOKEN for legacy support)
export const authendicateToken = (req, res, next) => {
    let getHeader = req.headers["authorization"];
    const token = getHeader && getHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ status: 'failed', message: 'No token provided' });
    } else {
        jwt.verify(token, process.env.ACCESS_TOKEN || 'secret', (err, user) => {
            if (err) {
                return res.status(403).json({ status: 'failed', message: 'Invalid or expired token' });
            } else {
                req.user = user;
                next();
            }
        });
    }
};

// Customer app token middleware (uses JWT_SECRET)
export const authenticateCustomerToken = (req, res, next) => {
    console.log("checktoken")
    let getHeader = req.headers["authorization"];
    const token = getHeader && getHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ status: 'failed', message: 'No token provided' });
    } else {
        jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
            if (err) {
                return res.status(403).json({ status: 'failed', message: 'Invalid or expired token' });
            } else {
                req.user = user;
                next();
            }
        });
    }
};


