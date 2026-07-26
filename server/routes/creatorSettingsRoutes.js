const express = require("express");

const {
    getNotificationSettings,
    updateNotificationSettings,
    updatePassword,
} = require("../controllers/creatorSettingsController");

const {
    authenticate,
    authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/notifications",
    authenticate,
    authorizeRoles("creator"),
    getNotificationSettings,
);

router.put(
    "/notifications",
    authenticate,
    authorizeRoles("creator"),
    updateNotificationSettings,
);

router.put(
    "/password",
    authenticate,
    authorizeRoles("creator"),
    updatePassword,
);

module.exports = router;