const express = require("express");
const {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
} = require("../controllers/categoryController");
const {
    authenticate,
    authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getCategories);

router.get(
    "/:id",
    authenticate,
    authorizeRoles("admin"),
    getCategoryById,
);

router.post(
    "/",
    authenticate,
    authorizeRoles("admin"),
    createCategory,
);

router.put(
    "/:id",
    authenticate,
    authorizeRoles("admin"),
    updateCategory,
);

router.delete(
    "/:id",
    authenticate,
    authorizeRoles("admin"),
    deleteCategory,
);

module.exports = router;