const fs = require("fs");
const path = require("path");
const multer = require("multer");

const uploadDirectory = path.join(
    __dirname,
    "..",
    "uploads",
    "profiles",
);

fs.mkdirSync(uploadDirectory, {
    recursive: true,
});

const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, uploadDirectory);
    },

    filename: (req, file, callback) => {
        const extension = path
            .extname(file.originalname)
            .toLowerCase();

        const safeExtension = [
            ".jpg",
            ".jpeg",
            ".png",
            ".webp",
        ].includes(extension)
            ? extension
            : ".jpg";

        const userId = req.user?.id || "creator";
        const randomNumber = Math.round(
            Math.random() * 1_000_000,
        );

        const filename =
            `profile-${userId}-${Date.now()}-${randomNumber}` +
            safeExtension;

        callback(null, filename);
    },
});

const uploader = multer({
    storage,

    limits: {
        fileSize: 3 * 1024 * 1024,
    },

    fileFilter: (req, file, callback) => {
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return callback(
                new Error(
                    "Foto profil harus berupa JPG, PNG, atau WebP.",
                ),
            );
        }

        return callback(null, true);
    },
});

const uploadProfilePhoto = (req, res, next) => {
    uploader.single("profile_photo")(req, res, (error) => {
        if (!error) {
            return next();
        }

        if (error instanceof multer.MulterError) {
            if (error.code === "LIMIT_FILE_SIZE") {
                return res.status(422).json({
                    success: false,
                    message:
                        "Ukuran foto profil maksimal 3 MB.",
                });
            }

            return res.status(422).json({
                success: false,
                message:
                    "Foto profil gagal diunggah.",
            });
        }

        return res.status(422).json({
            success: false,
            message:
                error.message ||
                "Foto profil gagal diunggah.",
        });
    });
};

module.exports = {
    uploadProfilePhoto,
};