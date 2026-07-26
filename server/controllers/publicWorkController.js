const database = require("../config/database");

const createPublicFileUrl = (req, filePath) => {
    if (!filePath) {
        return null;
    }

    if (/^https?:\/\//i.test(filePath)) {
        return filePath;
    }

    const normalizedPath = String(filePath).startsWith("/")
        ? filePath
        : `/${filePath}`;

    return `${req.protocol}://${req.get("host")}${normalizedPath}`;
};

const getPositiveInteger = (
    value,
    defaultValue,
    maximumValue = null,
) => {
    const parsedValue = Number.parseInt(value, 10);

    if (
        !Number.isInteger(parsedValue) ||
        parsedValue <= 0
    ) {
        return defaultValue;
    }

    if (
        maximumValue !== null &&
        parsedValue > maximumValue
    ) {
        return maximumValue;
    }

    return parsedValue;
};

const mapPublicWork = (req, work) => {
    const creatorId = Number(work.user_id);

    return {
        id: Number(work.id),
        title: work.title,
        slug: work.slug,
        description: work.description || "",

        thumbnail: work.thumbnail || null,

        thumbnail_url: createPublicFileUrl(
            req,
            work.thumbnail,
        ),

        project_url: work.project_url || null,

        likes_count: Number(
            work.likes_count || 0,
        ),

        views_count: Number(
            work.views_count || 0,
        ),

        category: work.category_name
            ? {
                  id: work.category_id
                      ? Number(work.category_id)
                      : null,

                  name: work.category_name,

                  slug:
                      work.category_slug || "",
              }
            : null,

        creator: {
            id: creatorId,
            name: work.creator_name,

            slug:
                work.creator_slug ||
                `creator-${creatorId}`,

            expertise:
                work.creator_expertise || "",

            location:
                work.creator_location || "",

            profile_photo:
                work.creator_profile_photo ||
                null,

            profile_photo_url:
                createPublicFileUrl(
                    req,
                    work.creator_profile_photo,
                ),
        },

        created_at: work.created_at,
        updated_at: work.updated_at,
    };
};

const getPublicWorks = async (req, res) => {
    try {
        const page = getPositiveInteger(
            req.query.page,
            1,
        );

        const limit = getPositiveInteger(
            req.query.limit,
            12,
            40,
        );

        const offset = (page - 1) * limit;

        const search =
            typeof req.query.search === "string"
                ? req.query.search.trim()
                : "";

        const category =
            typeof req.query.category === "string"
                ? req.query.category.trim()
                : "";

        const sort =
            req.query.sort === "popular"
                ? "popular"
                : "latest";

        const whereConditions = [
            "works.status = 'approved'",
            "users.role = 'creator'",
            "users.status = 'aktif'",
        ];

        const queryParameters = [];

        if (search) {
            const searchPattern = `%${search}%`;

            whereConditions.push(
                `(
                    works.title LIKE ?
                    OR works.description LIKE ?
                    OR users.name LIKE ?
                    OR creator_profiles.expertise LIKE ?
                    OR categories.name LIKE ?
                )`,
            );

            queryParameters.push(
                searchPattern,
                searchPattern,
                searchPattern,
                searchPattern,
                searchPattern,
            );
        }

        if (category) {
            whereConditions.push(
                "categories.slug = ?",
            );

            queryParameters.push(category);
        }

        const whereSql =
            whereConditions.join("\nAND ");

        const orderSql =
            sort === "popular"
                ? `works.likes_count DESC,
                   works.views_count DESC,
                   works.created_at DESC,
                   works.id DESC`
                : `works.created_at DESC,
                   works.id DESC`;

        const [countRows] =
            await database.execute(
                `SELECT
                    COUNT(DISTINCT works.id)
                        AS total

                 FROM works

                 INNER JOIN users
                    ON users.id = works.user_id

                 INNER JOIN creator_profiles
                    ON creator_profiles.user_id =
                       users.id

                 LEFT JOIN categories
                    ON categories.id =
                       works.category_id

                 WHERE ${whereSql}`,
                queryParameters,
            );

        const total = Number(
            countRows[0]?.total || 0,
        );

        const [workRows] =
            await database.execute(
                `SELECT
                    works.id,
                    works.user_id,
                    works.category_id,
                    works.title,
                    works.slug,
                    works.description,
                    works.thumbnail,
                    works.project_url,
                    works.likes_count,
                    works.views_count,
                    works.created_at,
                    works.updated_at,

                    categories.name
                        AS category_name,

                    categories.slug
                        AS category_slug,

                    users.name
                        AS creator_name,

                    creator_profiles.slug
                        AS creator_slug,

                    creator_profiles.expertise
                        AS creator_expertise,

                    creator_profiles.location
                        AS creator_location,

                    creator_profiles.profile_photo
                        AS creator_profile_photo

                 FROM works

                 INNER JOIN users
                    ON users.id = works.user_id

                 INNER JOIN creator_profiles
                    ON creator_profiles.user_id =
                       users.id

                 LEFT JOIN categories
                    ON categories.id =
                       works.category_id

                 WHERE ${whereSql}

                 ORDER BY ${orderSql}

                 LIMIT ${limit}
                 OFFSET ${offset}`,
                queryParameters,
            );

        const [categoryRows] =
            await database.execute(
                `SELECT
                    categories.id,
                    categories.name,
                    categories.slug,

                    COUNT(works.id)
                        AS works_count

                 FROM categories

                 INNER JOIN works
                    ON works.category_id =
                       categories.id

                 INNER JOIN users
                    ON users.id = works.user_id

                 WHERE works.status = 'approved'
                   AND users.role = 'creator'
                   AND users.status = 'aktif'

                 GROUP BY
                    categories.id,
                    categories.name,
                    categories.slug

                 ORDER BY
                    works_count DESC,
                    categories.name ASC`,
            );

        const totalPages =
            total > 0
                ? Math.ceil(total / limit)
                : 0;

        return res.status(200).json({
            success: true,
            message:
                "Daftar karya berhasil diambil.",

            data: {
                works: workRows.map((work) =>
                    mapPublicWork(req, work),
                ),

                categories: categoryRows.map(
                    (categoryItem) => ({
                        id: Number(
                            categoryItem.id,
                        ),

                        name:
                            categoryItem.name,

                        slug:
                            categoryItem.slug,

                        works_count: Number(
                            categoryItem.works_count ||
                                0,
                        ),
                    }),
                ),

                filters: {
                    search,
                    category,
                    sort,
                },

                pagination: {
                    page,
                    limit,
                    total,

                    total_pages:
                        totalPages,

                    has_previous_page:
                        page > 1,

                    has_next_page:
                        page < totalPages,
                },
            },
        });
    } catch (error) {
        console.error(
            "Get public works error:",
            error,
        );

        return res.status(500).json({
            success: false,
            message:
                "Terjadi kesalahan saat mengambil daftar karya.",
        });
    }
};

const getPublicWorkDetail = async (
    req,
    res,
) => {
    try {
        const slug =
            typeof req.params.slug === "string"
                ? req.params.slug.trim()
                : "";

        if (!slug) {
            return res.status(422).json({
                success: false,
                message: "Slug karya tidak valid.",
            });
        }

        const [workRows] =
            await database.execute(
                `SELECT
                    works.id,
                    works.user_id,
                    works.category_id,
                    works.title,
                    works.slug,
                    works.description,
                    works.thumbnail,
                    works.project_url,
                    works.likes_count,
                    works.views_count,
                    works.created_at,
                    works.updated_at,

                    categories.name
                        AS category_name,

                    categories.slug
                        AS category_slug,

                    users.name
                        AS creator_name,

                    creator_profiles.slug
                        AS creator_slug,

                    creator_profiles.expertise
                        AS creator_expertise,

                    creator_profiles.location
                        AS creator_location,

                    creator_profiles.profile_photo
                        AS creator_profile_photo

                 FROM works

                 INNER JOIN users
                    ON users.id = works.user_id

                 INNER JOIN creator_profiles
                    ON creator_profiles.user_id =
                       users.id

                 LEFT JOIN categories
                    ON categories.id =
                       works.category_id

                 WHERE works.slug = ?
                   AND works.status = 'approved'
                   AND users.role = 'creator'
                   AND users.status = 'aktif'

                 LIMIT 1`,
                [slug],
            );

        if (workRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Karya tidak ditemukan.",
            });
        }

        const work = workRows[0];

        const workId = Number(work.id);
        const creatorId = Number(
            work.user_id,
        );

        const [relatedRows] =
            await database.execute(
                `SELECT
                    works.id,
                    works.user_id,
                    works.category_id,
                    works.title,
                    works.slug,
                    works.description,
                    works.thumbnail,
                    works.project_url,
                    works.likes_count,
                    works.views_count,
                    works.created_at,
                    works.updated_at,

                    categories.name
                        AS category_name,

                    categories.slug
                        AS category_slug,

                    users.name
                        AS creator_name,

                    creator_profiles.slug
                        AS creator_slug,

                    creator_profiles.expertise
                        AS creator_expertise,

                    creator_profiles.location
                        AS creator_location,

                    creator_profiles.profile_photo
                        AS creator_profile_photo

                 FROM works

                 INNER JOIN users
                    ON users.id = works.user_id

                 INNER JOIN creator_profiles
                    ON creator_profiles.user_id =
                       users.id

                 LEFT JOIN categories
                    ON categories.id =
                       works.category_id

                 WHERE works.user_id = ?
                   AND works.id != ?
                   AND works.status = 'approved'
                   AND users.status = 'aktif'

                 ORDER BY
                    works.likes_count DESC,
                    works.views_count DESC,
                    works.created_at DESC

                 LIMIT 4`,
                [
                    creatorId,
                    workId,
                ],
            );

        return res.status(200).json({
            success: true,
            message:
                "Detail karya berhasil diambil.",

            data: {
                work: mapPublicWork(
                    req,
                    work,
                ),

                related_works:
                    relatedRows.map(
                        (relatedWork) =>
                            mapPublicWork(
                                req,
                                relatedWork,
                            ),
                    ),
            },
        });
    } catch (error) {
        console.error(
            "Get public work detail error:",
            error,
        );

        return res.status(500).json({
            success: false,
            message:
                "Terjadi kesalahan saat mengambil detail karya.",
        });
    }
};

const registerWorkView = async (
    req,
    res,
) => {
    try {
        const slug =
            typeof req.params.slug === "string"
                ? req.params.slug.trim()
                : "";

        if (!slug) {
            return res.status(422).json({
                success: false,
                message: "Slug karya tidak valid.",
            });
        }

        const [workRows] =
            await database.execute(
                `SELECT id
                 FROM works
                 WHERE slug = ?
                   AND status = 'approved'
                 LIMIT 1`,
                [slug],
            );

        if (workRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Karya tidak ditemukan.",
            });
        }

        const workId = Number(
            workRows[0].id,
        );

        await database.execute(
            `UPDATE works
             SET views_count =
                 views_count + 1
             WHERE id = ?`,
            [workId],
        );

        const [updatedRows] =
            await database.execute(
                `SELECT views_count
                 FROM works
                 WHERE id = ?
                 LIMIT 1`,
                [workId],
            );

        return res.status(200).json({
            success: true,
            message:
                "Jumlah dilihat berhasil diperbarui.",

            data: {
                work_id: workId,

                views_count: Number(
                    updatedRows[0]
                        ?.views_count || 0,
                ),
            },
        });
    } catch (error) {
        console.error(
            "Register work view error:",
            error,
        );

        return res.status(500).json({
            success: false,
            message:
                "Terjadi kesalahan saat mencatat jumlah dilihat.",
        });
    }
};

module.exports = {
    getPublicWorks,
    getPublicWorkDetail,
    registerWorkView,
};