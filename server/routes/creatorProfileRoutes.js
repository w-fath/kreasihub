const express = require("express");

const {
    getCreatorProfile,
    updateCreatorProfile,
} = require(
    "../controllers/creatorProfileController",
);

const {
    authenticate,
    authorizeRoles,
} = require("../middleware/authMiddleware");

const {
    uploadProfilePhoto,
} = require(
    "../middleware/profileUploadMiddleware",
);

const router = express.Router();

router.get(
    "/",
    authenticate,
    authorizeRoles("creator"),
    getCreatorProfile,
);

router.put(
    "/",
    authenticate,
    authorizeRoles("creator"),
    uploadProfilePhoto,
    updateCreatorProfile,
);

module.exports = router;