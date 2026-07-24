const bcrypt = require('bcryptjs');
const database = require('../config/database');

const register = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            passwordConfirmation,
        } = req.body;

        if (
            !name ||
            !email ||
            !password ||
            !passwordConfirmation
        ) {
            return res.status(400).json({
                success: false,
                message: 'Semua data wajib diisi.',
            });
        }

        const normalizedName = name.trim();
        const normalizedEmail = email.trim().toLowerCase();

        if (normalizedName.length < 3) {
            return res.status(400).json({
                success: false,
                message: 'Nama minimal terdiri dari 3 karakter.',
            });
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: 'Format email tidak valid.',
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password minimal terdiri dari 8 karakter.',
            });
        }

        if (password !== passwordConfirmation) {
            return res.status(400).json({
                success: false,
                message: 'Konfirmasi password tidak sesuai.',
            });
        }

        const [existingUsers] = await database.execute(
            'SELECT id FROM users WHERE email = ? LIMIT 1',
            [normalizedEmail]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Email sudah terdaftar.',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await database.execute(
            `INSERT INTO users
                (name, email, password, role)
             VALUES (?, ?, ?, ?)`,
            [
                normalizedName,
                normalizedEmail,
                hashedPassword,
                'creator',
            ]
        );

        return res.status(201).json({
            success: true,
            message: 'Registrasi berhasil.',
            data: {
                id: result.insertId,
                name: normalizedName,
                email: normalizedEmail,
                role: 'creator',
            },
        });
    } catch (error) {
        console.error('Register error:', error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                success: false,
                message: 'Email sudah terdaftar.',
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server.',
        });
    }
};

module.exports = {
    register,
};