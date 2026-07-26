const fs = require("fs/promises");
const database = require("../config/database");

const normalizeText = (value) => {
    if (typeof value !== "string") {
        return "";
    }

    return value.trim().replace(/\s+/g, " ");
};

const createSlug = (value) => {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
};

const generateUniqueSlug = async (title) => {
    const baseSlug = createSlug(title) || "karya";

    let slug = baseSlug;
    let counter = 2;

    while (true) {
        const [works] = await database.execute(
            `SELECT id
             FROM works
             WHERE slug = ?
             LIMIT 1`,
            [slug],
        );

        if (works.length === 0) {
            return slug;
        }

        slug = `${baseSlug}-${counter}`;
        counter += 1;
    }
};

const removeUploadedFile = async (file) => {
    if (!file?.path) {
        return;
    }

    try {
        await fs.unlink(file.path);
    } catch (error) {
        if (error.code !== "ENOENT") {
            console.error(
                "Remove uploaded work file error:",
                error,
            );
        }
    }
};

const isValidProjectUrl = (value) => {
    if (!value) {
        return true;
    }

    try {
        const parsedUrl = new URL(value);

        return (
            parsedUrl.protocol === "http:" ||
            parsedUrl.protocol === "https:"
        );
    } catch {
        return false;
    }
};

const createWork = async (req, res) => {
    const validationError = async (status, message) => {
        await removeUploadedFile(req.file);

        return res.status(status).json({
            success: false,
            message,
        });
    };

    try {
        const userId = Number(req.user.id);
        const categoryId = Number(req.body.category_id);

        const title = normalizeText(req.body.title);
        const description =
            typeof req.body.description === "string"
                ? req.body.description.trim()
                : "";

        const projectUrl =
            typeof req.body.project_url === "string"
                ? req.body.project_url.trim()
                : "";

        if (!Number.isInteger(userId) || userId <= 0) {
            return validationError(
                401,
                "Data pengguna tidak valid.",
            );
        }

        if (!title) {
            return validationError(
                422,
                "Judul karya wajib diisi.",
            );
        }

        if (title.length < 3) {
            return validationError(
                422,
                "Judul karya minimal 3 karakter.",
            );
        }

        if (title.length > 150) {
            return validationError(
                422,
                "Judul karya maksimal 150 karakter.",
            );
        }

        if (
            !Number.isInteger(categoryId) ||
            categoryId <= 0
        ) {
            return validationError(
                422,
                "Kategori karya wajib dipilih.",
            );
        }

        if (!description) {
            return validationError(
                422,
                "Deskripsi karya wajib diisi.",
            );
        }

        if (description.length < 10) {
            return validationError(
                422,
                "Deskripsi karya minimal 10 karakter.",
            );
        }

        if (description.length > 2000) {
            return validationError(
                422,
                "Deskripsi karya maksimal 2000 karakter.",
            );
        }

        if (!req.file) {
            return validationError(
                422,
                "Thumbnail karya wajib dipilih.",
            );
        }

        if (!isValidProjectUrl(projectUrl)) {
            return validationError(
                422,
                "Tautan project harus menggunakan http:// atau https://.",
            );
        }

        const [categories] = await database.execute(
            `SELECT id, name
             FROM categories
             WHERE id = ?
             LIMIT 1`,
            [categoryId],
        );

        if (categories.length === 0) {
            return validationError(
                404,
                "Kategori karya tidak ditemukan.",
            );
        }

        const slug = await generateUniqueSlug(title);

        const thumbnailPath = `/uploads/works/${req.file.filename}`;

        const [result] = await database.execute(
            `INSERT INTO works (
                user_id,
                category_id,
                title,
                slug,
                description,
                thumbnail,
                project_url
             )
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                userId,
                categoryId,
                title,
                slug,
                description,
                thumbnailPath,
                projectUrl || null,
            ],
        );

        const [works] = await database.execute(
            `SELECT
                works.id,
                works.user_id,
                works.category_id,
                works.title,
                works.slug,
                works.description,
                works.thumbnail,
                works.project_url,
                works.status,
                works.views_count,
                works.likes_count,
                works.created_at,
                works.updated_at,
                categories.name AS category_name,
                users.name AS creator_name
             FROM works
             INNER JOIN categories
                ON categories.id = works.category_id
             INNER JOIN users
                ON users.id = works.user_id
             WHERE works.id = ?
             LIMIT 1`,
            [result.insertId],
        );

        const work = works[0];

        return res.status(201).json({
            success: true,
            message:
                "Karya berhasil ditambahkan dan menunggu review admin.",
            data: {
                ...work,
                thumbnail_url:
                    `${req.protocol}://${req.get("host")}` +
                    work.thumbnail,
            },
        });
    } catch (error) {
        await removeUploadedFile(req.file);

        console.error("Create work error:", error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message:
                    "Data karya mengalami konflik. Silakan coba kembali.",
            });
        }

        if (error.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(422).json({
                success: false,
                message:
                    "Pengguna atau kategori karya tidak valid.",
            });
        }

        return res.status(500).json({
            success: false,
            message:
                "Terjadi kesalahan saat menyimpan karya.",
        });
    }
};

const getMyWorks = async (req, res) => {
    try {
        const userId = Number(req.user.id);

        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(401).json({
                success: false,
                message: "Data pengguna tidak valid.",
            });
        }

        const [works] = await database.execute(
            `SELECT
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
                categories.name AS category_name,
                categories.slug AS category_slug
             FROM works
             INNER JOIN categories
                ON categories.id = works.category_id
             WHERE works.user_id = ?
             ORDER BY works.created_at DESC`,
            [userId],
        );

        const formattedWorks = works.map((work) => ({
            ...work,
            thumbnail_url:
                `${req.protocol}://${req.get("host")}${work.thumbnail}`,
        }));

        return res.status(200).json({
            success: true,
            message: "Data karya berhasil diambil.",
            data: formattedWorks,
        });
    } catch (error) {
        console.error("Get creator works error:", error);

        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengambil data karya.",
        });
    }
};

const getCreatorSummary = async (req, res) => {
    try {
        const userId = Number(req.user.id);

        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(401).json({
                success: false,
                message: "Data pengguna tidak valid.",
            });
        }

        const [summaryRows] = await database.execute(
            `SELECT
                COUNT(*) AS total_works,
                COALESCE(SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END), 0) AS approved_works,
                COALESCE(SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END), 0) AS pending_works,
                COALESCE(SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END), 0) AS rejected_works,
                COALESCE(SUM(views_count), 0) AS total_views,
                COALESCE(SUM(likes_count), 0) AS total_likes
             FROM works
             WHERE user_id = ?`,
            [userId],
        );

        const [recentWorks] = await database.execute(
            `SELECT
                works.id,
                works.title,
                works.slug,
                works.thumbnail,
                works.project_url,
                works.status,
                works.views_count,
                works.likes_count,
                works.created_at,
                categories.name AS category_name
             FROM works
             INNER JOIN categories
                ON categories.id = works.category_id
             WHERE works.user_id = ?
             ORDER BY works.created_at DESC
             LIMIT 4`,
            [userId],
        );

        const rawSummary = summaryRows[0];

        return res.status(200).json({
            success: true,
            message: "Ringkasan creator berhasil diambil.",
            data: {
                summary: {
                    total_works: Number(rawSummary.total_works || 0),
                    approved_works: Number(rawSummary.approved_works || 0),
                    pending_works: Number(rawSummary.pending_works || 0),
                    rejected_works: Number(rawSummary.rejected_works || 0),
                    total_views: Number(rawSummary.total_views || 0),
                    total_likes: Number(rawSummary.total_likes || 0),
                },
                recent_works: recentWorks.map((work) => ({
                    ...work,
                    views_count: Number(work.views_count || 0),
                    likes_count: Number(work.likes_count || 0),
                    thumbnail_url: `${req.protocol}://${req.get("host")}${work.thumbnail}`,
                })),
            },
        });
    } catch (error) {
        console.error("Get creator summary error:", error);

        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengambil ringkasan creator.",
        });
    }
};

module.exports = {
    createWork,
    getMyWorks,
    getCreatorSummary,
};