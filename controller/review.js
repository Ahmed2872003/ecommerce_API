// models
const Review = require("../model/review.js");
const Product = require("../model/product.js");
const Customer = require("../model/customer.js");

const { Sequelize, fn, col } = require("sequelize");
const { StatusCodes } = require("http-status-codes");

// utility
const calcWeightRate = require("../utility/calcWeightRate");

const getReviewsTableFor = require("../utility/getReviewsTableFor");

const CustomApiError = require("../errors/custom.js");

const createReview = async (req, res, next) => {
  await Review.create({ ...req.body, CustomerId: req.customerId });

  res.sendStatus(StatusCodes.CREATED);

  // Adding the ratting to the product
  const productRatingTable = await getReviewsTableFor(req.body.ProductId);

  const weightedRate = await calcWeightRate(productRatingTable);

  await Product.update(
    { rating: +weightedRate },
    { where: { id: req.body.ProductId } }
  );
};

const getReviews = async (req, res, next) => {
  const { productId } = req.body;

  const reviews = await Review.findAll({
    raw: true,
    attributes: {
      include: [
        [
          fn(
            "concat",
            col("customer.first_name"),
            " ",
            col("customer.last_name")
          ),
          "customerName",
        ],
      ],
      exclude: ["ProductId"],
    },

    include: {
      model: Customer,
      attributes: [],
      required: true,
    },

    where: {
      productId,
    },
    order: [["rating", "DESC"]],
  });

  res.status(StatusCodes.OK).json({ data: reviews, length: reviews.length });
};

const updateReview = async (req, res, next) => {
  const { reviewId: id } = req.params;

  const review = await Review.findByPk(id);

  if (!review) throw new CustomApiError(`No review found with that id: ${id}`);

  await review.update(req.body);

  res.sendStatus(StatusCodes.OK);

  // Adding the ratting to the product
  if (req.body.rating) {
    const productRatingTable = await getReviewsTableFor(
      review.getDataValue("ProductId")
    );

    const weightedRate = await calcWeightRate(productRatingTable);

    await Product.update(
      { rating: +weightedRate },
      { where: { id: review.getDataValue("ProductId") } }
    );
  }
};

const deleteReview = async (req, res, next) => {
  const { reviewId: id } = req.params;

  const review = await Review.findByPk(id);

  if (!review) throw new CustomApiError(`No review found with that id: ${id}`);

  await review.destroy();

  res.sendStatus(StatusCodes.OK);

  // Adding the ratting to the product
  const productRatingTable = await getReviewsTableFor(
    review.getDataValue("ProductId")
  );

  const weightedRate = await calcWeightRate(productRatingTable);

  await Product.update(
    { rating: +weightedRate },
    { where: { id: review.getDataValue("ProductId") } }
  );
};

module.exports = { createReview, getReviews, updateReview, deleteReview };
