const router = require("express").Router();

const { createReview } = require("../controller/review.js");

router.post("/", createReview);

module.exports = router;
