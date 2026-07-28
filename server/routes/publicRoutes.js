const express = require("express");

const {
    getPublicCreators,
    getCreatorExpertises,
} = require(
    "../controllers/publicCreatorController",
);

const {
    getPublicCreatorDetail,
} = require(
    "../controllers/publicCreatorDetailController",
);

const {
    getPublicWorks,
    getPublicWorkDetail,
    registerWorkView,
} = require(
    "../controllers/publicWorkController",
);

const router = express.Router();

router.get(
    "/creator-expertises",
    getCreatorExpertises,
);

router.get(
    "/creators",
    getPublicCreators,
);

router.get(
    "/creators/:slug",
    getPublicCreatorDetail,
);


router.get(
    "/works",
    getPublicWorks,
);

router.post(
    "/works/:slug/view",
    registerWorkView,
);

router.get(
    "/works/:slug",
    getPublicWorkDetail,
);

module.exports = router;