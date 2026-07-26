const express = require("express");

const {
    createWork,
    getMyWorks,
    getCreatorSummary,
} = require("../controllers/workController");

const {
    authenticate,
    authorizeRoles,
} = require("../middleware/authMiddleware");

const {
    uploadWorkThumbnail,
} = require("../middleware/workUploadMiddleware");

const router = express.Router();

router.get(
    "/summary",
    authenticate,
    authorizeRoles("creator"),
    getCreatorSummary,
);

router.get(
    "/",
    authenticate,
    authorizeRoles("creator"),
    getMyWorks,
);

router.post(
    "/",
    authenticate,
    authorizeRoles("creator"),
    uploadWorkThumbnail,
    createWork,
);

module.exports = router;