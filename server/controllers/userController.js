const database = require('../config/database');

const getUsers = async (req, res) => {
    try {
        const [users] = await database.execute(
            `SELECT id, name, email, role, status, created_at, updated_at
             FROM users
             ORDER BY created_at DESC`
        );

        return res.status(200).json({
            success: true,
            message: 'Data pengguna berhasil diambil.',
            data: users,
        });
    } catch (error) {
        console.error('Get users error:', error);

        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan saat mengambil data pengguna.',
        });
    }
};

module.exports = {
    getUsers,
};