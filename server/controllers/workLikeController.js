const database = require("../config/database");

const getValidWork = async (
    connection,
    workId,
) => {
    const [rows] = await connection.execute(
        `SELECT id
         FROM works
         WHERE id = ?
           AND status = 'approved'
         LIMIT 1`,
        [workId],
    );

    return rows[0] || null;
};

const synchronizeLikesCount = async (
    connection,
    workId,
) => {
    const [countRows] =
        await connection.execute(
            `SELECT COUNT(*) AS total
             FROM work_likes
             WHERE work_id = ?`,
            [workId],
        );

    const likesCount = Number(
        countRows[0]?.total || 0,
    );

    await connection.execute(
        `UPDATE works
         SET likes_count = ?
         WHERE id = ?`,
        [
            likesCount,
            workId,
        ],
    );

    return likesCount;
};

const getWorkLikeStatus = async (
    req,
    res,
) => {
    try {
        const userId = Number(req.user.id);
        const workId = Number(
            req.params.workId,
        );

        if (
            !Number.isInteger(workId) ||
            workId <= 0
        ) {
            return res.status(422).json({
                success: false,
                message: "ID karya tidak valid.",
            });
        }

        const [workRows] = await database.execute(
            `SELECT
                works.id,
                works.likes_count,

                EXISTS (
                    SELECT 1
                    FROM work_likes
                    WHERE work_likes.work_id =
                          works.id
                      AND work_likes.user_id = ?
                ) AS liked

             FROM works

             WHERE works.id = ?
               AND works.status = 'approved'

             LIMIT 1`,
            [
                userId,
                workId,
            ],
        );

        if (workRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Karya tidak ditemukan.",
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Status suka berhasil diambil.",

            data: {
                work_id: workId,

                liked:
                    Boolean(
                        Number(
                            workRows[0].liked,
                        ),
                    ),

                likes_count: Number(
                    workRows[0]
                        .likes_count || 0,
                ),
            },
        });
    } catch (error) {
        console.error(
            "Get work like status error:",
            error,
        );

        return res.status(500).json({
            success: false,
            message:
                "Terjadi kesalahan saat mengambil status suka.",
        });
    }
};

const likeWork = async (req, res) => {
    const connection =
        await database.getConnection();

    try {
        const userId = Number(req.user.id);
        const workId = Number(
            req.params.workId,
        );

        if (
            !Number.isInteger(userId) ||
            userId <= 0
        ) {
            connection.release();

            return res.status(401).json({
                success: false,
                message: "Data pengguna tidak valid.",
            });
        }

        if (
            !Number.isInteger(workId) ||
            workId <= 0
        ) {
            connection.release();

            return res.status(422).json({
                success: false,
                message: "ID karya tidak valid.",
            });
        }

        await connection.beginTransaction();

        const work = await getValidWork(
            connection,
            workId,
        );

        if (!work) {
            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Karya tidak ditemukan.",
            });
        }

        await connection.execute(
            `INSERT IGNORE INTO work_likes (
                user_id,
                work_id
             ) VALUES (?, ?)`,
            [
                userId,
                workId,
            ],
        );

        const likesCount =
            await synchronizeLikesCount(
                connection,
                workId,
            );

        await connection.commit();

        return res.status(200).json({
            success: true,
            message: "Karya berhasil disukai.",

            data: {
                work_id: workId,
                liked: true,
                likes_count: likesCount,
            },
        });
    } catch (error) {
        await connection.rollback();

        console.error(
            "Like work error:",
            error,
        );

        return res.status(500).json({
            success: false,
            message:
                "Terjadi kesalahan saat menyukai karya.",
        });
    } finally {
        connection.release();
    }
};

const unlikeWork = async (req, res) => {
    const connection =
        await database.getConnection();

    try {
        const userId = Number(req.user.id);
        const workId = Number(
            req.params.workId,
        );

        if (
            !Number.isInteger(userId) ||
            userId <= 0
        ) {
            connection.release();

            return res.status(401).json({
                success: false,
                message: "Data pengguna tidak valid.",
            });
        }

        if (
            !Number.isInteger(workId) ||
            workId <= 0
        ) {
            connection.release();

            return res.status(422).json({
                success: false,
                message: "ID karya tidak valid.",
            });
        }

        await connection.beginTransaction();

        const work = await getValidWork(
            connection,
            workId,
        );

        if (!work) {
            await connection.rollback();

            return res.status(404).json({
                success: false,
                message: "Karya tidak ditemukan.",
            });
        }

        await connection.execute(
            `DELETE FROM work_likes
             WHERE user_id = ?
               AND work_id = ?`,
            [
                userId,
                workId,
            ],
        );

        const likesCount =
            await synchronizeLikesCount(
                connection,
                workId,
            );

        await connection.commit();

        return res.status(200).json({
            success: true,
            message:
                "Suka pada karya berhasil dibatalkan.",

            data: {
                work_id: workId,
                liked: false,
                likes_count: likesCount,
            },
        });
    } catch (error) {
        await connection.rollback();

        console.error(
            "Unlike work error:",
            error,
        );

        return res.status(500).json({
            success: false,
            message:
                "Terjadi kesalahan saat membatalkan suka.",
        });
    } finally {
        connection.release();
    }
};

module.exports = {
    getWorkLikeStatus,
    likeWork,
    unlikeWork,
};