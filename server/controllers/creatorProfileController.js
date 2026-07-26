const fs = require("fs");
const path = require("path");

const database = require("../config/database");

const serverRoot = path.join(__dirname, "..");
const uploadsRoot = path.join(serverRoot, "uploads");

const profileSelectQuery = `
    SELECT
        users.id,
        users.name,
        users.email,
        users.role,
        users.status,

        creator_profiles.slug,
        creator_profiles.expertise,
        creator_profiles.bio,
        creator_profiles.location,
        creator_profiles.portfolio_url,
        creator_profiles.github_url,
        creator_profiles.linkedin_url,
        creator_profiles.instagram_url,
        creator_profiles.behance_url,
        creator_profiles.dribbble_url,
        creator_profiles.profile_photo,

        COALESCE(
            creator_profiles.created_at,
            users.created_at
        ) AS created_at,

        COALESCE(
            creator_profiles.updated_at,
            users.updated_at
        ) AS updated_at

    FROM users

    LEFT JOIN creator_profiles
        ON creator_profiles.user_id = users.id

    WHERE users.id = ?
      AND users.role = 'creator'

    LIMIT 1
`;

const removeUploadedFile = (publicFilePath) => {
    if (!publicFilePath) {
        return;
    }

    try {
        const relativePath = publicFilePath.replace(
            /^\/+/,
            "",
        );

        const absolutePath = path.normalize(
            path.join(serverRoot, relativePath),
        );

        const normalizedUploadsRoot =
            path.normalize(uploadsRoot);

        if (
            !absolutePath.startsWith(
                normalizedUploadsRoot,
            )
        ) {
            return;
        }

        if (fs.existsSync(absolutePath)) {
            fs.unlinkSync(absolutePath);
        }
    } catch (error) {
        console.error(
            "Remove profile photo error:",
            error.message,
        );
    }
};

const createSlug = (value) => {
    return String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
};

const generateUniqueSlug = async (
    connection,
    name,
    userId,
) => {
    const baseSlug =
        createSlug(name) || `creator-${userId}`;

    let slug = baseSlug;
    let counter = 1;

    while (true) {
        const [existingProfiles] =
            await connection.execute(
                `SELECT id
                 FROM creator_profiles
                 WHERE slug = ?
                   AND user_id != ?
                 LIMIT 1`,
                [slug, userId],
            );

        if (existingProfiles.length === 0) {
            return slug;
        }

        counter += 1;
        slug = `${baseSlug}-${counter}`;
    }
};

const isValidOptionalUrl = (value) => {
    if (!value) {
        return true;
    }

    try {
        const parsedUrl = new URL(value);

        return [
            "http:",
            "https:",
        ].includes(parsedUrl.protocol);
    } catch {
        return false;
    }
};

const formatProfileData = (req, row) => {
    const profilePhotoUrl = row.profile_photo
        ? `${req.protocol}://${req.get("host")}${row.profile_photo}`
        : null;

    return {
        id: Number(row.id),
        name: row.name,
        email: row.email,
        role: row.role,
        status: row.status,

        slug: row.slug || "",
        expertise: row.expertise || "",
        bio: row.bio || "",
        location: row.location || "",

        portfolio_url: row.portfolio_url || "",
        github_url: row.github_url || "",
        linkedin_url: row.linkedin_url || "",
        instagram_url: row.instagram_url || "",
        behance_url: row.behance_url || "",
        dribbble_url: row.dribbble_url || "",

        profile_photo:
            row.profile_photo || null,

        profile_photo_url:
            profilePhotoUrl,

        created_at: row.created_at,
        updated_at: row.updated_at,
    };
};

const getCreatorProfile = async (req, res) => {
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

        const [profiles] = await database.execute(
            profileSelectQuery,
            [userId],
        );

        if (profiles.length === 0) {
            return res.status(404).json({
                success: false,
                message:
                    "Profil creator tidak ditemukan.",
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Profil creator berhasil diambil.",
            data: formatProfileData(
                req,
                profiles[0],
            ),
        });
    } catch (error) {
        console.error(
            "Get creator profile error:",
            error,
        );

        return res.status(500).json({
            success: false,
            message:
                "Terjadi kesalahan saat mengambil profil creator.",
        });
    }
};

const updateCreatorProfile = async (req, res) => {
    const userId = Number(req.user.id);

    const name =
        typeof req.body.name === "string"
            ? req.body.name.trim()
            : "";

    const expertise =
        typeof req.body.expertise === "string"
            ? req.body.expertise.trim()
            : "";

    const bio =
        typeof req.body.bio === "string"
            ? req.body.bio.trim()
            : "";

    const location =
        typeof req.body.location === "string"
            ? req.body.location.trim()
            : "";

    const portfolioUrl =
        typeof req.body.portfolio_url === "string"
            ? req.body.portfolio_url.trim()
            : "";

    const githubUrl =
        typeof req.body.github_url === "string"
            ? req.body.github_url.trim()
            : "";

    const linkedinUrl =
        typeof req.body.linkedin_url === "string"
            ? req.body.linkedin_url.trim()
            : "";

    const instagramUrl =
        typeof req.body.instagram_url === "string"
            ? req.body.instagram_url.trim()
            : "";

    const behanceUrl =
        typeof req.body.behance_url === "string"
            ? req.body.behance_url.trim()
            : "";

    const dribbbleUrl =
        typeof req.body.dribbble_url === "string"
            ? req.body.dribbble_url.trim()
            : "";

    const newProfilePhoto = req.file
        ? `/uploads/profiles/${req.file.filename}`
        : null;

    const rejectRequest = (
        statusCode,
        message,
    ) => {
        if (newProfilePhoto) {
            removeUploadedFile(newProfilePhoto);
        }

        return res.status(statusCode).json({
            success: false,
            message,
        });
    };

    if (
        !Number.isInteger(userId) ||
        userId <= 0
    ) {
        return rejectRequest(
            401,
            "Data pengguna tidak valid.",
        );
    }

    if (!name) {
        return rejectRequest(
            422,
            "Nama lengkap wajib diisi.",
        );
    }

    if (name.length > 100) {
        return rejectRequest(
            422,
            "Nama lengkap maksimal 100 karakter.",
        );
    }

    if (expertise.length > 255) {
        return rejectRequest(
            422,
            "Keahlian maksimal 255 karakter.",
        );
    }

    if (bio.length > 3000) {
        return rejectRequest(
            422,
            "Bio maksimal 3000 karakter.",
        );
    }

    if (location.length > 150) {
        return rejectRequest(
            422,
            "Alamat atau lokasi maksimal 150 karakter.",
        );
    }

    const profileLinks = [
        {
            label: "Website atau portofolio",
            value: portfolioUrl,
        },
        {
            label: "GitHub",
            value: githubUrl,
        },
        {
            label: "LinkedIn",
            value: linkedinUrl,
        },
        {
            label: "Instagram",
            value: instagramUrl,
        },
        {
            label: "Behance",
            value: behanceUrl,
        },
        {
            label: "Dribbble",
            value: dribbbleUrl,
        },
    ];

    for (const link of profileLinks) {
        if (link.value.length > 500) {
            return rejectRequest(
                422,
                `${link.label} maksimal 500 karakter.`,
            );
        }

        if (!isValidOptionalUrl(link.value)) {
            return rejectRequest(
                422,
                `${link.label} harus menggunakan http:// atau https://.`,
            );
        }
    }

    let connection;
    let oldProfilePhoto = null;
    let transactionStarted = false;
    let transactionCommitted = false;

    try {
        connection =
            await database.getConnection();

        await connection.beginTransaction();
        transactionStarted = true;

        const [users] =
            await connection.execute(
                `SELECT
                    id,
                    role,
                    status
                 FROM users
                 WHERE id = ?
                 LIMIT 1
                 FOR UPDATE`,
                [userId],
            );

        if (
            users.length === 0 ||
            users[0].role !== "creator"
        ) {
            await connection.rollback();
            transactionStarted = false;

            return rejectRequest(
                404,
                "Akun creator tidak ditemukan.",
            );
        }

        if (users[0].status !== "aktif") {
            await connection.rollback();
            transactionStarted = false;

            return rejectRequest(
                403,
                "Akun creator sedang tidak aktif.",
            );
        }

        const [profiles] =
            await connection.execute(
                `SELECT
                    id,
                    slug,
                    profile_photo
                 FROM creator_profiles
                 WHERE user_id = ?
                 LIMIT 1
                 FOR UPDATE`,
                [userId],
            );

        await connection.execute(
            `UPDATE users
             SET name = ?
             WHERE id = ?`,
            [name, userId],
        );

        if (profiles.length > 0) {
            oldProfilePhoto =
                profiles[0].profile_photo;

            const profilePhoto =
                newProfilePhoto ||
                oldProfilePhoto ||
                null;

            await connection.execute(
                `UPDATE creator_profiles
                 SET
                    expertise = ?,
                    bio = ?,
                    location = ?,
                    portfolio_url = ?,
                    github_url = ?,
                    linkedin_url = ?,
                    instagram_url = ?,
                    behance_url = ?,
                    dribbble_url = ?,
                    profile_photo = ?
                 WHERE user_id = ?`,
                [
                    expertise || null,
                    bio || null,
                    location || null,
                    portfolioUrl || null,
                    githubUrl || null,
                    linkedinUrl || null,
                    instagramUrl || null,
                    behanceUrl || null,
                    dribbbleUrl || null,
                    profilePhoto,
                    userId,
                ],
            );
        } else {
            const slug =
                await generateUniqueSlug(
                    connection,
                    name,
                    userId,
                );

            await connection.execute(
                `INSERT INTO creator_profiles (
                    user_id,
                    slug,
                    expertise,
                    bio,
                    location,
                    portfolio_url,
                    github_url,
                    linkedin_url,
                    instagram_url,
                    behance_url,
                    dribbble_url,
                    profile_photo
                 ) VALUES (
                    ?, ?, ?, ?, ?, ?,
                    ?, ?, ?, ?, ?, ?
                 )`,
                [
                    userId,
                    slug,
                    expertise || null,
                    bio || null,
                    location || null,
                    portfolioUrl || null,
                    githubUrl || null,
                    linkedinUrl || null,
                    instagramUrl || null,
                    behanceUrl || null,
                    dribbbleUrl || null,
                    newProfilePhoto,
                ],
            );
        }

        await connection.commit();
        transactionCommitted = true;

        if (
            newProfilePhoto &&
            oldProfilePhoto &&
            newProfilePhoto !== oldProfilePhoto
        ) {
            removeUploadedFile(oldProfilePhoto);
        }

        const [updatedProfiles] =
            await database.execute(
                profileSelectQuery,
                [userId],
            );

        if (updatedProfiles.length === 0) {
            return res.status(500).json({
                success: false,
                message:
                    "Profil sudah diperbarui, tetapi data terbaru gagal diambil.",
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Profil creator berhasil diperbarui.",
            data: formatProfileData(
                req,
                updatedProfiles[0],
            ),
        });
    } catch (error) {
        if (
            connection &&
            transactionStarted &&
            !transactionCommitted
        ) {
            try {
                await connection.rollback();
            } catch (rollbackError) {
                console.error(
                    "Rollback profile error:",
                    rollbackError.message,
                );
            }
        }

        if (
            newProfilePhoto &&
            !transactionCommitted
        ) {
            removeUploadedFile(newProfilePhoto);
        }

        console.error(
            "Update creator profile error:",
            error,
        );

        return res.status(500).json({
            success: false,
            message:
                "Terjadi kesalahan saat memperbarui profil creator.",
        });
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

module.exports = {
    getCreatorProfile,
    updateCreatorProfile,
};