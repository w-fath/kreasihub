const express = require("express");

const {
    getAdminDashboardSummary,
    getAdminWorks,
    updateWorkStatus,
} = require("../controllers/adminDashboardController");

const {
    authenticate,
    authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/dashboard/summary",
    authenticate,
    authorizeRoles("admin"),
    getAdminDashboardSummary,
);

router.get(
    "/works",
    authenticate,
    authorizeRoles("admin"),
    getAdminWorks,
);

router.patch(
    "/works/:id/status",
    authenticate,
    authorizeRoles("admin"),
    updateWorkStatus,
);

module.exports = router;