const Review = require("../model/review.js");
const { fn } = require("sequelize");

const getReviewsTableFor = async (productId) => {
  return await Review.findAll({
    attributes: ["rating", [fn("COUNT", "id"), "weight"]],

    where: {
      productId,
    },
    group: "rating",
  });
};

module.exports = getReviewsTableFor;
