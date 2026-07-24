const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const database = require('../config/database');

const register = async (req, res) => {
    try {
        const { name, email, password, passwordConfirmation } = req.body;

        if (!name || !email || !password || !passwordConfirmation) {
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
            `INSERT INTO users (name, email, password, role)
             VALUES (?, ?, ?, ?)`,
            [normalizedName, normalizedEmail, hashedPassword, 'creator']
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

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email dan password wajib diisi.',
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const [users] = await database.execute(
            `SELECT id, name, email, password, role
             FROM users
             WHERE email = ?
             LIMIT 1`,
            [normalizedEmail]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Email atau password salah.',
            });
        }

        const user = users[0];

        const passwordIsValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(401).json({
                success: false,
                message: 'Email atau password salah.',
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET belum dikonfigurasi.');

            return res.status(500).json({
                success: false,
                message: 'Konfigurasi autentikasi belum tersedia.',
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || '1d',
            }
        );

        return res.status(200).json({
            success: true,
            message: 'Login berhasil.',
            token,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Login error:', error);

        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan pada server.',
        });
    }
};

module.exports = {
    register,
    login,
};