const bcrypt = require("bcryptjs");
const database = require("../config/database");

const getNotificationSettings = async (req, res) => {
    try {
        const userId = Number(req.user.id);

        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(401).json({
                success: false,
                message: "Data pengguna tidak valid.",
            });
        }

        const [settings] = await database.execute(
            `SELECT
                review_notifications,
                portfolio_notifications
             FROM user_preferences
             WHERE user_id = ?
             LIMIT 1`,
            [userId],
        );

        if (settings.length === 0) {
            return res.status(200).json({
                success: true,
                message: "Preferensi notifikasi berhasil diambil.",
                data: {
                    review_notifications: true,
                    portfolio_notifications: true,
                },
            });
        }

        return res.status(200).json({
            success: true,
            message: "Preferensi notifikasi berhasil diambil.",
            data: {
                review_notifications:
                    Boolean(settings[0].review_notifications),
                portfolio_notifications:
                    Boolean(settings[0].portfolio_notifications),
            },
        });
    } catch (error) {
        console.error("Get notification settings error:", error);

        return res.status(500).json({
            success: false,
            message:
                "Terjadi kesalahan saat mengambil preferensi notifikasi.",
        });
    }
};

const updateNotificationSettings = async (req, res) => {
    try {
        const userId = Number(req.user.id);

        const {
            review_notifications: reviewNotifications,
            portfolio_notifications: portfolioNotifications,
        } = req.body;

        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(401).json({
                success: false,
                message: "Data pengguna tidak valid.",
            });
        }

        if (
            typeof reviewNotifications !== "boolean" ||
            typeof portfolioNotifications !== "boolean"
        ) {
            return res.status(422).json({
                success: false,
                message: "Data preferensi notifikasi tidak valid.",
            });
        }

        await database.execute(
            `INSERT INTO user_preferences (
                user_id,
                review_notifications,
                portfolio_notifications
             ) VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE
                review_notifications = ?,
                portfolio_notifications = ?`,
            [
                userId,
                reviewNotifications ? 1 : 0,
                portfolioNotifications ? 1 : 0,
                reviewNotifications ? 1 : 0,
                portfolioNotifications ? 1 : 0,
            ],
        );

        return res.status(200).json({
            success: true,
            message: "Preferensi notifikasi berhasil disimpan.",
            data: {
                review_notifications: reviewNotifications,
                portfolio_notifications: portfolioNotifications,
            },
        });
    } catch (error) {
        console.error("Update notification settings error:", error);

        return res.status(500).json({
            success: false,
            message:
                "Terjadi kesalahan saat menyimpan preferensi notifikasi.",
        });
    }
};

const updatePassword = async (req, res) => {
    try {
        const userId = Number(req.user.id);

        const currentPassword =
            typeof req.body.current_password === "string"
                ? req.body.current_password
                : "";

        const newPassword =
            typeof req.body.new_password === "string"
                ? req.body.new_password
                : "";

        const confirmPassword =
            typeof req.body.confirm_password === "string"
                ? req.body.confirm_password
                : "";

        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(401).json({
                success: false,
                message: "Data pengguna tidak valid.",
            });
        }

        if (!currentPassword) {
            return res.status(422).json({
                success: false,
                message: "Password saat ini wajib diisi.",
            });
        }

        if (!newPassword) {
            return res.status(422).json({
                success: false,
                message: "Password baru wajib diisi.",
            });
        }

        if (newPassword.length < 8) {
            return res.status(422).json({
                success: false,
                message: "Password baru minimal 8 karakter.",
            });
        }

        if (newPassword.length > 72) {
            return res.status(422).json({
                success: false,
                message: "Password baru maksimal 72 karakter.",
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(422).json({
                success: false,
                message: "Konfirmasi password baru tidak sama.",
            });
        }

        const [users] = await database.execute(
            `SELECT id, password
             FROM users
             WHERE id = ?
               AND role = 'creator'
             LIMIT 1`,
            [userId],
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Akun creator tidak ditemukan.",
            });
        }

        const passwordIsValid = await bcrypt.compare(
            currentPassword,
            users[0].password,
        );

        if (!passwordIsValid) {
            return res.status(422).json({
                success: false,
                message: "Password saat ini tidak sesuai.",
            });
        }

        const sameAsCurrentPassword = await bcrypt.compare(
            newPassword,
            users[0].password,
        );

        if (sameAsCurrentPassword) {
            return res.status(422).json({
                success: false,
                message:
                    "Password baru tidak boleh sama dengan password saat ini.",
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await database.execute(
            `UPDATE users
             SET password = ?
             WHERE id = ?`,
            [hashedPassword, userId],
        );

        return res.status(200).json({
            success: true,
            message: "Password berhasil diperbarui.",
        });
    } catch (error) {
        console.error("Update creator password error:", error);

        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat memperbarui password.",
        });
    }
};

module.exports = {
    getNotificationSettings,
    updateNotificationSettings,
    updatePassword,
};