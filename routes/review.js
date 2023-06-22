const router = require("express").Router();

const {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
} = require("../controller/review.js");

router.route("/").post(createReview).get(getReviews);

router.route("/:reviewId").patch(updateReview).delete(deleteReview);

module.exports = router;
