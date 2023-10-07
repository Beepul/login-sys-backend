const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const publicKey = fs.readFileSync(path.resolve(__dirname,'../public.key'),'utf-8');

const jwtVerify = (req, res, next) => {
    const header = req.get('Authorization')
    if(header){
        const token = header.split('Bearer ')[1];
        try {
            const decoded = jwt.verify(token, publicKey);
            if (decoded.email && decoded.role) {
                req.auth = decoded.role;
                next();
            } else {
                res.status(401).json({
                    message: 'You are not authorized!'
                });
            }
        } catch (error) {
            res.status(401).json({
                message: 'Authentication failed'
            });
        }
    }else{
        res.status(401).json({
            message: 'No permission to access this route!!!'
        })
    }

}

const roleAuthorization = (allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.auth;
        if (allowedRoles.includes(userRole)) {
            next();
        } else {
            res.status(403).json({
                message: 'You do not have permission to access this resource.'
            });
        }
    };
};


module.exports = { jwtVerify, roleAuthorization };
