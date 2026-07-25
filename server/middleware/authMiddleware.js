const jwt = require('jsonwebtoken');
const database = require('../config/database');

const authenticate = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Silakan login terlebih dahulu.',
            });
        }

        const token = authorizationHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token autentikasi tidak ditemukan.',
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (typeof decoded !== 'object' || !decoded.id) {
            return res.status(401).json({
                success: false,
                message: 'Token autentikasi tidak valid.',
            });
        }

        const [users] = await database.execute(
            `SELECT id, name, email, role
             FROM users
             WHERE id = ?
             LIMIT 1`,
            [decoded.id],
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Pengguna tidak ditemukan.',
            });
        }

        req.user = users[0];

        next();
    } catch (error) {
        console.error('Authentication error:', error.message);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Sesi login telah berakhir. Silakan login kembali.',
            });
        }

        return res.status(401).json({
            success: false,
            message: 'Token autentikasi tidak valid.',
        });
    }
};

const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Kamu tidak memiliki akses ke halaman ini.',
            });
        }

        next();
    };
};

module.exports = {
    authenticate,
    authorizeRoles,
};