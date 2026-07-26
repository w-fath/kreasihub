const fs = require("fs");
const path = require("path");
const multer = require("multer");

const uploadDirectory = path.join(
    __dirname,
    "..",
    "uploads",
    "works",
);

fs.mkdirSync(uploadDirectory, {
    recursive: true,
});

const allowedMimeTypes = new Set([
    "image/png",
    "image/jpeg",
    "image/webp",
]);

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, uploadDirectory);
    },

    filename: (req, file, callback) => {
        const extension = path
            .extname(file.originalname)
            .toLowerCase();

        const randomName = `${Date.now()}-${Math.round(
            Math.random() * 1e9,
        )}`;

        callback(null, `${randomName}${extension}`);
    },
});

const upload = multer({
    storage,

    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1,
    },

    fileFilter: (req, file, callback) => {
        if (!allowedMimeTypes.has(file.mimetype)) {
            const error = new Error(
                "Thumbnail harus menggunakan format PNG, JPG, JPEG, atau WEBP.",
            );

            error.code = "INVALID_FILE_TYPE";

            callback(error);
            return;
        }

        callback(null, true);
    },
});

const uploadWorkThumbnail = (req, res, next) => {
    upload.single("thumbnail")(req, res, (error) => {
        if (!error) {
            next();
            return;
        }

        if (error instanceof multer.MulterError) {
            if (error.code === "LIMIT_FILE_SIZE") {
                return res.status(422).json({
                    success: false,
                    message: "Ukuran thumbnail maksimal 5 MB.",
                });
            }

            if (error.code === "LIMIT_UNEXPECTED_FILE") {
                return res.status(422).json({
                    success: false,
                    message: "Field upload thumbnail tidak sesuai.",
                });
            }

            return res.status(422).json({
                success: false,
                message: error.message || "Thumbnail gagal diunggah.",
            });
        }

        return res.status(422).json({
            success: false,
            message:
                error.message ||
                "File thumbnail tidak dapat diproses.",
        });
    });
};

module.exports = {
    uploadWorkThumbnail,
};