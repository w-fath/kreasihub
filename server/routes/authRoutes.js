const express = require('express');
const { register, login } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/me', authenticate, (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'Sesi pengguna valid.',
        data: req.user,
    });
});

module.exports = router;