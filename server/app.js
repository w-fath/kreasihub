require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");

const database = require("./config/database");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const workRoutes = require("./routes/workRoutes");

const creatorProfileRoutes = require(
    "./routes/creatorProfileRoutes",
);

const creatorSettingsRoutes = require(
    "./routes/creatorSettingsRoutes",
);

const creatorFollowRoutes = require(
    "./routes/creatorFollowRoutes",
);

const workLikeRoutes = require(
    "./routes/workLikeRoutes",
);

const adminRoutes = require(
    "./routes/adminRoutes",
);

const publicRoutes = require(
    "./routes/publicRoutes",
);

const app = express();
const PORT = Number(
    process.env.PORT || 3000,
);

app.use(
    cors({
        origin: "http://localhost:5173",

        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
        ],

        allowedHeaders: [
            "Content-Type",
            "Authorization",
        ],
    }),
);

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    }),
);

app.use(
    "/uploads",
    express.static(
        path.join(
            __dirname,
            "uploads",
        ),
    ),
);

app.get("/", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "KreasiHub API berjalan.",
    });
});

/*
|--------------------------------------------------------------------------
| Public
|--------------------------------------------------------------------------
*/

app.use(
    "/api/public",
    publicRoutes,
);

/*
|--------------------------------------------------------------------------
| Authentication and General
|--------------------------------------------------------------------------
*/

app.use(
    "/api/auth",
    authRoutes,
);

app.use(
    "/api/users",
    userRoutes,
);

app.use(
    "/api/categories",
    categoryRoutes,
);

/*
|--------------------------------------------------------------------------
| Creator
|--------------------------------------------------------------------------
*/

app.use(
    "/api/creator/profile",
    creatorProfileRoutes,
);

app.use(
    "/api/creator/works",
    workRoutes,
);

app.use(
    "/api/creator/settings",
    creatorSettingsRoutes,
);

app.use(
    "/api/creator-follows",
    creatorFollowRoutes,
);

/*
|--------------------------------------------------------------------------
| Work Interactions
|--------------------------------------------------------------------------
*/

app.use(
    "/api/work-likes",
    workLikeRoutes,
);

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

app.use(
    "/api/admin",
    adminRoutes,
);

/*
|--------------------------------------------------------------------------
| Not Found
|--------------------------------------------------------------------------
*/

app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: "Endpoint tidak ditemukan.",
    });
});

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/

app.use((error, req, res, next) => {
    console.error(
        "Unhandled server error:",
        error,
    );

    if (res.headersSent) {
        return next(error);
    }

    return res.status(500).json({
        success: false,
        message:
            "Terjadi kesalahan internal pada server.",
    });
});

const startServer = async () => {
    try {
        const connection =
            await database.getConnection();

        console.log(
            "Database MySQL berhasil terhubung.",
        );

        connection.release();

        app.listen(PORT, () => {
            console.log(
                `Server berjalan di http://localhost:${PORT}`,
            );
        });
    } catch (error) {
        console.error(
            "Gagal terhubung ke database:",
            error.message,
        );

        process.exit(1);
    }
};

startServer();