const express = require("express");

const {
    getWorkLikeStatus,
    likeWork,
    unlikeWork,
} = require(
    "../controllers/workLikeController",
);

const {
    authenticate,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/:workId/status",
    authenticate,
    getWorkLikeStatus,
);

router.post(
    "/:workId",
    authenticate,
    likeWork,
);

router.delete(
    "/:workId",
    authenticate,
    unlikeWork,
);

module.exports = router;