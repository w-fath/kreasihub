const express = require("express");

const {
    getMyFollowedCreators,
    followCreator,
    unfollowCreator,
} = require(
    "../controllers/creatorFollowController",
);

const {
    authenticate,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/",
    authenticate,
    getMyFollowedCreators,
);

router.post(
    "/:creatorId",
    authenticate,
    followCreator,
);

router.delete(
    "/:creatorId",
    authenticate,
    unfollowCreator,
);

module.exports = router;