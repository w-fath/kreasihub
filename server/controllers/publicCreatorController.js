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

const getPublicCreators = async (req, res) => {
    try {
        const page = getPositiveInteger(
            req.query.page,
            1,
        );

        const limit = getPositiveInteger(
            req.query.limit,
            8,
            20,
        );

        const offset = (page - 1) * limit;

        const search =
            typeof req.query.search === "string"
                ? req.query.search.trim()
                : "";

        const expertise =
            typeof req.query.expertise === "string"
                ? req.query.expertise.trim()
                : "";

        const whereConditions = [
            "users.role = 'creator'",
            "users.status = 'aktif'",
            `EXISTS (
                SELECT 1
                FROM works AS approved_works
                WHERE approved_works.user_id = users.id
                  AND approved_works.status = 'approved'
            )`,
        ];

        const queryParameters = [];

        if (search) {
            const searchPattern = `%${search}%`;

            whereConditions.push(
                `(
                    users.name LIKE ?
                    OR creator_profiles.expertise LIKE ?
                    OR creator_profiles.location LIKE ?
                    OR creator_profiles.bio LIKE ?
                )`,
            );

            queryParameters.push(
                searchPattern,
                searchPattern,
                searchPattern,
                searchPattern,
            );
        }

        if (expertise) {
            whereConditions.push(
                "creator_profiles.expertise = ?",
            );

            queryParameters.push(expertise);
        }

        const whereSql = whereConditions.join(
            "\nAND ",
        );

        const [countRows] = await database.execute(
            `SELECT
                COUNT(DISTINCT users.id) AS total

             FROM users

             INNER JOIN creator_profiles
                ON creator_profiles.user_id = users.id

             WHERE ${whereSql}`,
            queryParameters,
        );

        const total = Number(
            countRows[0]?.total || 0,
        );

        const [creatorRows] = await database.execute(
            `SELECT
                users.id,
                users.name,

                creator_profiles.slug,
                creator_profiles.expertise,
                creator_profiles.bio,
                creator_profiles.location,
                creator_profiles.profile_photo,

                creator_profiles.portfolio_url,
                creator_profiles.github_url,
                creator_profiles.linkedin_url,
                creator_profiles.instagram_url,
                creator_profiles.behance_url,
                creator_profiles.dribbble_url,

                (
                    SELECT COUNT(*)
                    FROM creator_follows
                    WHERE creator_follows.creator_user_id =
                          users.id
                ) AS followers_count,

                COUNT(works.id) AS projects_count,

                COALESCE(
                    SUM(works.likes_count),
                    0
                ) AS likes_count,

                COALESCE(
                    SUM(works.views_count),
                    0
                ) AS views_count

             FROM users

             INNER JOIN creator_profiles
                ON creator_profiles.user_id = users.id

             LEFT JOIN works
                ON works.user_id = users.id
               AND works.status = 'approved'

             WHERE ${whereSql}

             GROUP BY
                users.id,
                users.name,

                creator_profiles.slug,
                creator_profiles.expertise,
                creator_profiles.bio,
                creator_profiles.location,
                creator_profiles.profile_photo,

                creator_profiles.portfolio_url,
                creator_profiles.github_url,
                creator_profiles.linkedin_url,
                creator_profiles.instagram_url,
                creator_profiles.behance_url,
                creator_profiles.dribbble_url

             ORDER BY
                followers_count DESC,
                projects_count DESC,
                likes_count DESC,
                users.name ASC

             LIMIT ${limit}
             OFFSET ${offset}`,
            queryParameters,
        );

        const creatorIds = creatorRows.map(
            (creator) => Number(creator.id),
        );

        const creatorWorks = new Map();

        creatorIds.forEach((creatorId) => {
            creatorWorks.set(creatorId, []);
        });

        if (creatorIds.length > 0) {
            const placeholders = creatorIds
                .map(() => "?")
                .join(", ");

            const [workRows] = await database.execute(
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
                    works.created_at

                 FROM works

                 WHERE works.status = 'approved'
                   AND works.user_id IN (${placeholders})

                 ORDER BY
                    works.created_at DESC,
                    works.id DESC`,
                creatorIds,
            );

            workRows.forEach((work) => {
                const creatorId = Number(
                    work.user_id,
                );

                const currentWorks =
                    creatorWorks.get(creatorId);

                if (
                    !currentWorks ||
                    currentWorks.length >= 3
                ) {
                    return;
                }

                currentWorks.push({
                    id: Number(work.id),

                    category_id: work.category_id
                        ? Number(work.category_id)
                        : null,

                    title: work.title,
                    slug: work.slug,

                    description:
                        work.description || "",

                    thumbnail:
                        work.thumbnail || null,

                    thumbnail_url:
                        createPublicFileUrl(
                            req,
                            work.thumbnail,
                        ),

                    project_url:
                        work.project_url || null,

                    likes_count: Number(
                        work.likes_count || 0,
                    ),

                    views_count: Number(
                        work.views_count || 0,
                    ),

                    created_at:
                        work.created_at,
                });
            });
        }

        const creators = creatorRows.map(
            (creator) => {
                const creatorId = Number(
                    creator.id,
                );

                return {
                    id: creatorId,
                    name: creator.name,

                    slug:
                        creator.slug ||
                        `creator-${creatorId}`,

                    expertise:
                        creator.expertise || "",

                    bio:
                        creator.bio || "",

                    location:
                        creator.location || "",

                    profile_photo:
                        creator.profile_photo || null,

                    profile_photo_url:
                        createPublicFileUrl(
                            req,
                            creator.profile_photo,
                        ),

                    links: {
                        portfolio:
                            creator.portfolio_url ||
                            null,

                        github:
                            creator.github_url ||
                            null,

                        linkedin:
                            creator.linkedin_url ||
                            null,

                        instagram:
                            creator.instagram_url ||
                            null,

                        behance:
                            creator.behance_url ||
                            null,

                        dribbble:
                            creator.dribbble_url ||
                            null,
                    },

                    stats: {
                        projects: Number(
                            creator.projects_count ||
                                0,
                        ),

                        followers: Number(
                            creator.followers_count ||
                                0,
                        ),

                        likes: Number(
                            creator.likes_count || 0,
                        ),

                        views: Number(
                            creator.views_count || 0,
                        ),
                    },

                    works:
                        creatorWorks.get(
                            creatorId,
                        ) || [],
                };
            },
        );

        const totalPages =
            total > 0
                ? Math.ceil(total / limit)
                : 0;

        return res.status(200).json({
            success: true,
            message:
                "Daftar kreator berhasil diambil.",

            data: {
                creators,

                filters: {
                    search,
                    expertise,
                },

                pagination: {
                    page,
                    limit,
                    total,
                    total_pages: totalPages,

                    has_previous_page:
                        page > 1,

                    has_next_page:
                        page < totalPages,
                },
            },
        });
    } catch (error) {
        console.error(
            "Get public creators error:",
            error,
        );

        return res.status(500).json({
            success: false,
            message:
                "Terjadi kesalahan saat mengambil daftar kreator.",
        });
    }
};

const getCreatorExpertises = async (req, res) => {
    try {
        const [rows] = await database.execute(
            `SELECT
                TRIM(
                    creator_profiles.expertise
                ) AS expertise,

                COUNT(
                    DISTINCT users.id
                ) AS creators_count

             FROM creator_profiles

             INNER JOIN users
                ON users.id =
                   creator_profiles.user_id

             WHERE users.role = 'creator'
               AND users.status = 'aktif'

               AND creator_profiles.expertise
                   IS NOT NULL

               AND TRIM(
                   creator_profiles.expertise
               ) != ''

               AND EXISTS (
                   SELECT 1
                   FROM works
                   WHERE works.user_id =
                         users.id
                     AND works.status =
                         'approved'
               )

             GROUP BY
                TRIM(
                    creator_profiles.expertise
                )

             ORDER BY
                creators_count DESC,
                expertise ASC`,
        );

        const expertises = rows.map((row) => ({
            name: row.expertise,

            creators_count: Number(
                row.creators_count || 0,
            ),
        }));

        return res.status(200).json({
            success: true,
            message:
                "Daftar keahlian kreator berhasil diambil.",

            data: {
                featured: expertises.slice(0, 4),
                others: expertises.slice(4),
                total: expertises.length,
            },
        });
    } catch (error) {
        console.error(
            "Get creator expertises error:",
            error,
        );

        return res.status(500).json({
            success: false,
            message:
                "Terjadi kesalahan saat mengambil daftar keahlian kreator.",
        });
    }
};

module.exports = {
    getPublicCreators,
    getCreatorExpertises,
};