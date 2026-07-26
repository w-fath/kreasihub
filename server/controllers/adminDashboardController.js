const database = require("../config/database");

const getAdminDashboardSummary = async (req, res) => {
    try {
        const [summaryRows] = await database.execute(`
            SELECT
                (SELECT COUNT(*) FROM users) AS total_users,
                (SELECT COUNT(*) FROM works) AS total_works,
                (
                    SELECT COUNT(*)
                    FROM works
                    WHERE status = 'pending'
                ) AS pending_works,

                0 AS total_reports,

                (
                    SELECT COUNT(*)
                    FROM users
                    WHERE created_at >= DATE_FORMAT(CURRENT_DATE, '%Y-%m-01')
                ) AS users_this_month,

                (
                    SELECT COUNT(*)
                    FROM users
                    WHERE created_at >= DATE_FORMAT(
                        CURRENT_DATE - INTERVAL 1 MONTH,
                        '%Y-%m-01'
                    )
                    AND created_at < DATE_FORMAT(
                        CURRENT_DATE,
                        '%Y-%m-01'
                    )
                ) AS users_last_month,

                (
                    SELECT COUNT(*)
                    FROM works
                    WHERE created_at >= DATE_FORMAT(CURRENT_DATE, '%Y-%m-01')
                ) AS works_this_month,

                (
                    SELECT COUNT(*)
                    FROM works
                    WHERE created_at >= DATE_FORMAT(
                        CURRENT_DATE - INTERVAL 1 MONTH,
                        '%Y-%m-01'
                    )
                    AND created_at < DATE_FORMAT(
                        CURRENT_DATE,
                        '%Y-%m-01'
                    )
                ) AS works_last_month,

                (
                    SELECT COUNT(*)
                    FROM works
                    WHERE status = 'pending'
                    AND created_at >= DATE_FORMAT(CURRENT_DATE, '%Y-%m-01')
                ) AS pending_this_month,

                (
                    SELECT COUNT(*)
                    FROM works
                    WHERE status = 'pending'
                    AND created_at >= DATE_FORMAT(
                        CURRENT_DATE - INTERVAL 1 MONTH,
                        '%Y-%m-01'
                    )
                    AND created_at < DATE_FORMAT(
                        CURRENT_DATE,
                        '%Y-%m-01'
                    )
                ) AS pending_last_month
        `);

        const [activityRows] = await database.execute(`
            SELECT
                activity_id AS id,
                user_name AS user,
                action,
                activity_time,
                status
            FROM (
                SELECT
                    CONCAT('work-', works.id) AS activity_id,
                    users.name AS user_name,
                    'mengunggah karya baru' AS action,
                    works.created_at AS activity_time,
                    works.status AS status
                FROM works
                INNER JOIN users
                    ON users.id = works.user_id

                UNION ALL

                SELECT
                    CONCAT('user-', users.id) AS activity_id,
                    users.name AS user_name,
                    'mendaftar sebagai kreator' AS action,
                    users.created_at AS activity_time,
                    CASE
                        WHEN users.status = 'aktif' THEN 'approved'
                        ELSE 'rejected'
                    END AS status
                FROM users
                WHERE users.role = 'creator'
            ) AS activities
            ORDER BY activity_time DESC
            LIMIT 5
        `);

        const [pendingWorks] = await database.execute(`
            SELECT
                works.id,
                works.title,
                works.description,
                works.thumbnail,
                works.project_url,
                works.status,
                works.created_at,
                users.name AS creator_name,
                users.email AS creator_email,
                categories.name AS category_name
            FROM works
            INNER JOIN users
                ON users.id = works.user_id
            INNER JOIN categories
                ON categories.id = works.category_id
            WHERE works.status = 'pending'
            ORDER BY works.created_at DESC
            LIMIT 3
        `);

        const rawSummary = summaryRows[0];

        return res.status(200).json({
            success: true,
            message: "Ringkasan dashboard admin berhasil diambil.",
            data: {
                summary: {
                    total_users: Number(rawSummary.total_users || 0),
                    total_works: Number(rawSummary.total_works || 0),
                    pending_works: Number(rawSummary.pending_works || 0),
                    total_reports: Number(rawSummary.total_reports || 0),

                    users_this_month: Number(rawSummary.users_this_month || 0),
                    users_last_month: Number(rawSummary.users_last_month || 0),

                    works_this_month: Number(rawSummary.works_this_month || 0),
                    works_last_month: Number(rawSummary.works_last_month || 0),

                    pending_this_month: Number(rawSummary.pending_this_month || 0),
                    pending_last_month: Number(rawSummary.pending_last_month || 0),
                },

                recent_activity: activityRows,

                pending_works: pendingWorks.map((work) => ({
                    ...work,
                    thumbnail_url: `${req.protocol}://${req.get("host")}${work.thumbnail}`,
                })),
            },
        });
    } catch (error) {
        console.error("Get admin dashboard summary error:", error);

        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengambil ringkasan dashboard admin.",
        });
    }
};

const updateWorkStatus = async (req, res) => {
    try {
        const workId = Number(req.params.id);
        const status =
            typeof req.body.status === "string"
                ? req.body.status.trim().toLowerCase()
                : "";

        const rejectionNote =
            typeof req.body.rejection_note === "string"
                ? req.body.rejection_note.trim()
                : "";

        if (!Number.isInteger(workId) || workId <= 0) {
            return res.status(400).json({
                success: false,
                message: "ID karya tidak valid.",
            });
        }

        if (!["approved", "rejected"].includes(status)) {
            return res.status(422).json({
                success: false,
                message: "Status karya harus approved atau rejected.",
            });
        }

        if (status === "rejected" && !rejectionNote) {
            return res.status(422).json({
                success: false,
                message: "Alasan penolakan wajib diisi.",
            });
        }

        if (rejectionNote.length > 1000) {
            return res.status(422).json({
                success: false,
                message: "Alasan penolakan maksimal 1000 karakter.",
            });
        }

        const [works] = await database.execute(
            `SELECT id, title, status
             FROM works
             WHERE id = ?
             LIMIT 1`,
            [workId],
        );

        if (works.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Karya tidak ditemukan.",
            });
        }

        await database.execute(
            `UPDATE works
             SET
                status = ?,
                rejection_note = ?
             WHERE id = ?`,
            [
                status,
                status === "rejected" ? rejectionNote : null,
                workId,
            ],
        );

        return res.status(200).json({
            success: true,
            message:
                status === "approved"
                    ? `Karya "${works[0].title}" berhasil disetujui.`
                    : `Karya "${works[0].title}" berhasil ditolak.`,
        });
    } catch (error) {
        console.error("Update work status error:", error);

        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat memperbarui status karya.",
        });
    }
};

const getAdminWorks = async (req, res) => {
    try {
        const [works] = await database.execute(`
            SELECT
                works.id,
                works.user_id,
                works.category_id,
                works.title,
                works.slug,
                works.description,
                works.thumbnail,
                works.project_url,
                works.status,
                works.rejection_note,
                works.views_count,
                works.likes_count,
                works.created_at,
                works.updated_at,
                users.name AS creator_name,
                users.email AS creator_email,
                categories.name AS category_name,
                categories.slug AS category_slug
            FROM works
            INNER JOIN users
                ON users.id = works.user_id
            INNER JOIN categories
                ON categories.id = works.category_id
            ORDER BY
                CASE works.status
                    WHEN 'pending' THEN 1
                    WHEN 'rejected' THEN 2
                    WHEN 'approved' THEN 3
                    ELSE 4
                END,
                works.created_at DESC
        `);

        const formattedWorks = works.map((work) => ({
            ...work,
            views_count: Number(work.views_count || 0),
            likes_count: Number(work.likes_count || 0),
            thumbnail_url: `${req.protocol}://${req.get("host")}${work.thumbnail}`,
        }));

        return res.status(200).json({
            success: true,
            message: "Data karya berhasil diambil.",
            data: formattedWorks,
        });
    } catch (error) {
        console.error("Get admin works error:", error);

        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengambil data karya.",
        });
    }
};

module.exports = {
    getAdminDashboardSummary,
    getAdminWorks,
    updateWorkStatus,
};