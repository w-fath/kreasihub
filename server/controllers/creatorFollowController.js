const database = require("../config/database");

const getFollowerCount = async (creatorId) => {
    const [rows] = await database.execute(
        `SELECT COUNT(*) AS total
         FROM creator_follows
         WHERE creator_user_id = ?`,
        [creatorId],
    );

    return Number(rows[0]?.total || 0);
};

const getMyFollowedCreators = async (req, res) => {
    try {
        const userId = Number(req.user.id);

        if (
            !Number.isInteger(userId) ||
            userId <= 0
        ) {
            return res.status(401).json({
                success: false,
                message: "Data pengguna tidak valid.",
            });
        }

        const [rows] = await database.execute(
            `SELECT creator_user_id
             FROM creator_follows
             WHERE follower_user_id = ?
             ORDER BY created_at DESC`,
            [userId],
        );

        return res.status(200).json({
            success: true,
            message:
                "Daftar kreator yang diikuti berhasil diambil.",
            data: {
                creator_ids: rows.map((row) =>
                    Number(row.creator_user_id),
                ),
            },
        });
    } catch (error) {
        console.error(
            "Get followed creators error:",
            error,
        );

        return res.status(500).json({
            success: false,
            message:
                "Terjadi kesalahan saat mengambil daftar mengikuti.",
        });
    }
};

const followCreator = async (req, res) => {
    try {
        const followerUserId = Number(req.user.id);
        const creatorUserId = Number(
            req.params.creatorId,
        );

        if (
            !Number.isInteger(followerUserId) ||
            followerUserId <= 0
        ) {
            return res.status(401).json({
                success: false,
                message: "Data pengguna tidak valid.",
            });
        }

        if (
            !Number.isInteger(creatorUserId) ||
            creatorUserId <= 0
        ) {
            return res.status(422).json({
                success: false,
                message: "ID kreator tidak valid.",
            });
        }

        if (followerUserId === creatorUserId) {
            return res.status(422).json({
                success: false,
                message:
                    "Kamu tidak dapat mengikuti akun sendiri.",
            });
        }

        const [creators] = await database.execute(
            `SELECT id
             FROM users
             WHERE id = ?
               AND role = 'creator'
               AND status = 'aktif'
             LIMIT 1`,
            [creatorUserId],
        );

        if (creators.length === 0) {
            return res.status(404).json({
                success: false,
                message:
                    "Kreator tidak ditemukan atau sedang tidak aktif.",
            });
        }

        await database.execute(
            `INSERT IGNORE INTO creator_follows (
                follower_user_id,
                creator_user_id
             ) VALUES (?, ?)`,
            [
                followerUserId,
                creatorUserId,
            ],
        );

        const followersCount =
            await getFollowerCount(creatorUserId);

        return res.status(200).json({
            success: true,
            message: "Kreator berhasil diikuti.",
            data: {
                creator_id: creatorUserId,
                following: true,
                followers_count: followersCount,
            },
        });
    } catch (error) {
        console.error(
            "Follow creator error:",
            error,
        );

        return res.status(500).json({
            success: false,
            message:
                "Terjadi kesalahan saat mengikuti kreator.",
        });
    }
};

const unfollowCreator = async (req, res) => {
    try {
        const followerUserId = Number(req.user.id);
        const creatorUserId = Number(
            req.params.creatorId,
        );

        if (
            !Number.isInteger(followerUserId) ||
            followerUserId <= 0
        ) {
            return res.status(401).json({
                success: false,
                message: "Data pengguna tidak valid.",
            });
        }

        if (
            !Number.isInteger(creatorUserId) ||
            creatorUserId <= 0
        ) {
            return res.status(422).json({
                success: false,
                message: "ID kreator tidak valid.",
            });
        }

        await database.execute(
            `DELETE FROM creator_follows
             WHERE follower_user_id = ?
               AND creator_user_id = ?`,
            [
                followerUserId,
                creatorUserId,
            ],
        );

        const followersCount =
            await getFollowerCount(creatorUserId);

        return res.status(200).json({
            success: true,
            message:
                "Kreator berhenti diikuti.",
            data: {
                creator_id: creatorUserId,
                following: false,
                followers_count: followersCount,
            },
        });
    } catch (error) {
        console.error(
            "Unfollow creator error:",
            error,
        );

        return res.status(500).json({
            success: false,
            message:
                "Terjadi kesalahan saat berhenti mengikuti kreator.",
        });
    }
};

module.exports = {
    getMyFollowedCreators,
    followCreator,
    unfollowCreator,
};