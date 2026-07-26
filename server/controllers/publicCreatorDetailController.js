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

const getPublicCreatorDetail = async (req, res) => {
    try {
        const slug =
            typeof req.params.slug === "string"
                ? req.params.slug.trim()
                : "";

        if (!slug) {
            return res.status(422).json({
                success: false,
                message: "Slug kreator tidak valid.",
            });
        }

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
                    FROM works
                    WHERE works.user_id = users.id
                      AND works.status = 'approved'
                ) AS projects_count,

                (
                    SELECT COUNT(*)
                    FROM creator_follows
                    WHERE creator_follows.creator_user_id =
                          users.id
                ) AS followers_count,

                (
                    SELECT COALESCE(
                        SUM(works.likes_count),
                        0
                    )
                    FROM works
                    WHERE works.user_id = users.id
                      AND works.status = 'approved'
                ) AS likes_count,

                (
                    SELECT COALESCE(
                        SUM(works.views_count),
                        0
                    )
                    FROM works
                    WHERE works.user_id = users.id
                      AND works.status = 'approved'
                ) AS views_count

             FROM users

             INNER JOIN creator_profiles
                ON creator_profiles.user_id = users.id

             WHERE creator_profiles.slug = ?
               AND users.role = 'creator'
               AND users.status = 'aktif'

             LIMIT 1`,
            [slug],
        );

        if (creatorRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Profil kreator tidak ditemukan.",
            });
        }

        const creator = creatorRows[0];
        const creatorId = Number(creator.id);

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
                works.created_at,
                works.updated_at,

                categories.name AS category_name,
                categories.slug AS category_slug

             FROM works

             LEFT JOIN categories
                ON categories.id = works.category_id

             WHERE works.user_id = ?
               AND works.status = 'approved'

             ORDER BY
                works.created_at DESC,
                works.id DESC`,
            [creatorId],
        );

        const works = workRows.map((work) => ({
            id: Number(work.id),

            category: work.category_id
                ? {
                      id: Number(work.category_id),
                      name: work.category_name || "",
                      slug: work.category_slug || "",
                  }
                : null,

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

            created_at: work.created_at,
            updated_at: work.updated_at,
        }));

        return res.status(200).json({
            success: true,
            message:
                "Detail profil kreator berhasil diambil.",

            data: {
                creator: {
                    id: creatorId,
                    name: creator.name,
                    slug: creator.slug,

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
                            creator.portfolio_url || null,

                        github:
                            creator.github_url || null,

                        linkedin:
                            creator.linkedin_url || null,

                        instagram:
                            creator.instagram_url || null,

                        behance:
                            creator.behance_url || null,

                        dribbble:
                            creator.dribbble_url || null,
                    },

                    stats: {
                        projects: Number(
                            creator.projects_count || 0,
                        ),

                        followers: Number(
                            creator.followers_count || 0,
                        ),

                        likes: Number(
                            creator.likes_count || 0,
                        ),

                        views: Number(
                            creator.views_count || 0,
                        ),
                    },
                },

                works,
            },
        });
    } catch (error) {
        console.error(
            "Get public creator detail error:",
            error,
        );

        return res.status(500).json({
            success: false,
            message:
                "Terjadi kesalahan saat mengambil detail kreator.",
        });
    }
};

module.exports = {
    getPublicCreatorDetail,
};