const express = require('express');
const { getUsers } = require('../controllers/userController');
const {
    authenticate,
    authorizeRoles,
} = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticate, authorizeRoles('admin'), getUsers);

module.exports = router;