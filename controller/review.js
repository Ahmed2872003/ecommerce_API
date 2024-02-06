// models
const Review = require("../model/review.js");
const Product = require("../model/product.js");
const Customer = require("../model/customer.js");

const { Sequelize, fn, col, Op } = require("sequelize");
const { StatusCodes } = require("http-status-codes");

// utility
const calcWeightRate = require("../utility/calcWeightRate");
const getReviewsTableFor = require("../utility/getReviewsTableFor");
const userToSeqFilter = require("../utility/filter.js");

// Errors
const notFound = require("../errors/notFound.js");
const CustomApiError = require("../errors/custom.js");

const createReview = async (req, res, next) => {
  if (req.customer.seller) {
    const product = await Product.findOne({
      where: { id: req.body.ProductId, SellerId: req.customer.id },
    });

    if (product) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Seller can not create a comment in his products" });
      return;
    }
  }

  await Review.create({ ...req.body, CustomerId: req.customer.id });

  // Adding the ratting to the product
  const productRatingTable = await getReviewsTableFor(req.body.ProductId);

  const weightedRate = await calcWeightRate(productRatingTable);

  await Product.update(
    { rating: +weightedRate },
    { where: { id: req.body.ProductId } }
  );

  res.sendStatus(StatusCodes.CREATED);
};

const getReviews = async (req, res, next) => {
  const { page = 1, limit = 0 } = req.query;

  offset = (+page - 1) * +limit;

  const filters = userToSeqFilter(req.originalUrl.split("?")[1]);

  const reviews = await Review.findAll({
    raw: true,
    attributes: {
      include: [
        [
          fn(
            "concat",
            col("Customer.first_name"),
            " ",
            col("Customer.last_name")
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
      [Op.and]: filters,
    },
    order: [
      ["rating", "DESC"],
      ["createdAt", "DESC"],
    ],
    limit: +limit || undefined,
    offset,
  });

  res
    .status(StatusCodes.OK)
    .json({ data: { reviews, length: reviews.length } });
};

const updateReview = async (req, res, next) => {
  const { reviewId: id } = req.params;

  const review = await Review.findByPk(id);

  if (!review) throw new notFound("review", id);

  if (review.getDataValue("CustomerId") !== req.customer.id)
    throw new CustomApiError(
      "You aren't allowed to edit others message",
      StatusCodes.FORBIDDEN
    );

  await review.update(req.body);

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

  res.sendStatus(StatusCodes.OK);
};

const deleteReview = async (req, res, next) => {
  const { reviewId: id } = req.params;

  const review = await Review.findByPk(id);

  if (!review) throw new notFound("review", id);

  if (review.getDataValue("CustomerId") !== req.customer.id)
    throw new CustomApiError(
      "You aren't allowed to delete others message",
      StatusCodes.FORBIDDEN
    );

  await review.destroy();

  // Adding the ratting to the product
  const productRatingTable = await getReviewsTableFor(
    review.getDataValue("ProductId")
  );

  const weightedRate = await calcWeightRate(productRatingTable);

  await Product.update(
    { rating: +weightedRate },
    { where: { id: review.getDataValue("ProductId") } }
  );

  res.sendStatus(StatusCodes.OK);
};

module.exports = { createReview, getReviews, updateReview, deleteReview };
