const Review = require("../model/review.js");
const Product = require("../model/product.js");
const { Sequelize, fn } = require("sequelize");

const { StatusCodes } = require("http-status-codes");

const calcWeightRate = require("../utility/calcWeightRate");

const createReview = async (req, res, next) => {
  await Review.create(req.body);

  res.sendStatus(StatusCodes.CREATED);

  // Adding the ratting to the product
  const productRatingTable = await Review.findAll({
    attributes: ["rating", [fn("COUNT", "id"), "weight"]],

    where: {
      ProductId: req.body.ProductId,
    },
    group: "rating",
  });

  const weightedRate = await calcWeightRate(productRatingTable);

  await Product.update(
    { rating: weightedRate },
    { where: { id: req.body.ProductId } }
  );
};

module.exports = { createReview };
