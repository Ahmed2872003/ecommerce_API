const Product = require("../model/product.js");
const { Sequelize, Op } = require("sequelize");
const Category = require("../model/category.js");
const Review = require("../model/review.js");

const sequelize = require("../DB/connect.js");
const userToSeqFilter = require("../utility/filter.js");
const { StatusCodes } = require("http-status-codes");

const getAllProducts = async (req, res, next) => {
  // Converting user filter to sequelize filter
  const filters = userToSeqFilter(req.query);

  const { page = 1, limit } = req.query;
  const offset = (+page - 1) * (+limit || 0);

  const products = await Product.findAll({
    raw: true,
    attributes: {
      exclude: ["description", "brand", "quantity", "CategoryId"],
      include: [[Sequelize.col("Category.name"), "category"]],
    },
    include: {
      model: Category,
      attributes: [],
      required: true,
    },
    where: {
      [Op.and]: filters,
    },
    order: [
      ["rating", "DESC"],
      ["id", "ASC"],
    ],
    limit: +limit || undefined,
    offset,
  });

  res.status(200).json({ data: products, length: products.length });
};

const getProduct = async (req, res, next) => {
  const { id } = req.params;

  const result = await Product.findOne({
    raw: true,
    attributes: {
      exclude: ["CategoryId"],
      include: [[sequelize.col("Category.name"), "category"]],
    },
    where: {
      id: { [Op.eq]: id },
    },
    include: {
      model: Category,
      attributes: [],
      required: true,
    },
  });

  if (!result) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `no product with ID: ${id}` });
    return;
  }

  res.status(200).json({ data: result });
};

module.exports = { getAllProducts, getProduct };
