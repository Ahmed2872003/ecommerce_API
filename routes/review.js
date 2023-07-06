const router = require("express").Router();

const {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
} = require("../controller/review.js");

const auth = require("../middleware/authorization.js");

router.get("/", getReviews);

router.use("/", auth);

router.route("/").post(createReview);

router.route("/:reviewId").patch(updateReview).delete(deleteReview);

module.exports = router;
