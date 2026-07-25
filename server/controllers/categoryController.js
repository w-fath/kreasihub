const database = require("../config/database");

const normalizeName = (value) => {
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

const generateUniqueSlug = async (name, excludeId = null) => {
    const baseSlug = createSlug(name) || "kategori";

    let slug = baseSlug;
    let counter = 2;
    let slugAvailable = false;

    while (!slugAvailable) {
        let query = `
            SELECT id
            FROM categories
            WHERE slug = ?
        `;

        const parameters = [slug];

        if (excludeId !== null) {
            query += " AND id <> ?";
            parameters.push(excludeId);
        }

        query += " LIMIT 1";

        const [categories] = await database.execute(query, parameters);

        if (categories.length === 0) {
            slugAvailable = true;
        } else {
            slug = `${baseSlug}-${counter}`;
            counter += 1;
        }
    }

    return slug;
};

const getCategories = async (req, res) => {
    try {
        const [categories] = await database.execute(`
            SELECT
                id,
                name,
                slug,
                0 AS total,
                created_at,
                updated_at
            FROM categories
            ORDER BY name ASC
        `);

        return res.status(200).json({
            success: true,
            message: "Data kategori berhasil diambil.",
            data: categories,
        });
    } catch (error) {
        console.error("Get categories error:", error);

        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengambil data kategori.",
        });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const categoryId = Number(req.params.id);

        if (!Number.isInteger(categoryId) || categoryId <= 0) {
            return res.status(400).json({
                success: false,
                message: "ID kategori tidak valid.",
            });
        }

        const [categories] = await database.execute(
            `SELECT
                id,
                name,
                slug,
                0 AS total,
                created_at,
                updated_at
             FROM categories
             WHERE id = ?
             LIMIT 1`,
            [categoryId],
        );

        if (categories.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Kategori tidak ditemukan.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Detail kategori berhasil diambil.",
            data: categories[0],
        });
    } catch (error) {
        console.error("Get category detail error:", error);

        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat mengambil detail kategori.",
        });
    }
};

const createCategory = async (req, res) => {
    try {
        const name = normalizeName(req.body.name);

        if (!name) {
            return res.status(422).json({
                success: false,
                message: "Nama kategori wajib diisi.",
            });
        }

        if (name.length < 2) {
            return res.status(422).json({
                success: false,
                message: "Nama kategori minimal 2 karakter.",
            });
        }

        if (name.length > 100) {
            return res.status(422).json({
                success: false,
                message: "Nama kategori maksimal 100 karakter.",
            });
        }

        const [existingCategories] = await database.execute(
            `SELECT id
             FROM categories
             WHERE LOWER(name) = LOWER(?)
             LIMIT 1`,
            [name],
        );

        if (existingCategories.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Nama kategori sudah digunakan.",
            });
        }

        const slug = await generateUniqueSlug(name);

        const [result] = await database.execute(
            `INSERT INTO categories (name, slug)
             VALUES (?, ?)`,
            [name, slug],
        );

        const [categories] = await database.execute(
            `SELECT
                id,
                name,
                slug,
                0 AS total,
                created_at,
                updated_at
             FROM categories
             WHERE id = ?
             LIMIT 1`,
            [result.insertId],
        );

        return res.status(201).json({
            success: true,
            message: "Kategori berhasil ditambahkan.",
            data: categories[0],
        });
    } catch (error) {
        console.error("Create category error:", error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "Nama atau slug kategori sudah digunakan.",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat menambahkan kategori.",
        });
    }
};

const updateCategory = async (req, res) => {
    try {
        const categoryId = Number(req.params.id);
        const name = normalizeName(req.body.name);

        if (!Number.isInteger(categoryId) || categoryId <= 0) {
            return res.status(400).json({
                success: false,
                message: "ID kategori tidak valid.",
            });
        }

        if (!name) {
            return res.status(422).json({
                success: false,
                message: "Nama kategori wajib diisi.",
            });
        }

        if (name.length < 2) {
            return res.status(422).json({
                success: false,
                message: "Nama kategori minimal 2 karakter.",
            });
        }

        if (name.length > 100) {
            return res.status(422).json({
                success: false,
                message: "Nama kategori maksimal 100 karakter.",
            });
        }

        const [existingCategory] = await database.execute(
            `SELECT id
             FROM categories
             WHERE id = ?
             LIMIT 1`,
            [categoryId],
        );

        if (existingCategory.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Kategori tidak ditemukan.",
            });
        }

        const [duplicateCategories] = await database.execute(
            `SELECT id
             FROM categories
             WHERE LOWER(name) = LOWER(?)
             AND id <> ?
             LIMIT 1`,
            [name, categoryId],
        );

        if (duplicateCategories.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Nama kategori sudah digunakan.",
            });
        }

        const slug = await generateUniqueSlug(name, categoryId);

        await database.execute(
            `UPDATE categories
             SET name = ?, slug = ?
             WHERE id = ?`,
            [name, slug, categoryId],
        );

        const [categories] = await database.execute(
            `SELECT
                id,
                name,
                slug,
                0 AS total,
                created_at,
                updated_at
             FROM categories
             WHERE id = ?
             LIMIT 1`,
            [categoryId],
        );

        return res.status(200).json({
            success: true,
            message: "Kategori berhasil diperbarui.",
            data: categories[0],
        });
    } catch (error) {
        console.error("Update category error:", error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "Nama atau slug kategori sudah digunakan.",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat memperbarui kategori.",
        });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const categoryId = Number(req.params.id);

        if (!Number.isInteger(categoryId) || categoryId <= 0) {
            return res.status(400).json({
                success: false,
                message: "ID kategori tidak valid.",
            });
        }

        const [categories] = await database.execute(
            `SELECT id, name
             FROM categories
             WHERE id = ?
             LIMIT 1`,
            [categoryId],
        );

        if (categories.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Kategori tidak ditemukan.",
            });
        }

        await database.execute(
            `DELETE FROM categories
             WHERE id = ?`,
            [categoryId],
        );

        return res.status(200).json({
            success: true,
            message: `Kategori "${categories[0].name}" berhasil dihapus.`,
        });
    } catch (error) {
        console.error("Delete category error:", error);

        if (error.code === "ER_ROW_IS_REFERENCED_2") {
            return res.status(409).json({
                success: false,
                message: "Kategori tidak dapat dihapus karena masih digunakan oleh karya.",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat menghapus kategori.",
        });
    }
};

module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};