const { Op, col } = require("sequelize");

// Models
const Category = require("../model/category.js");
const Product = require("../model/product.js");

const { StatusCodes } = require("http-status-codes");

// Utility
const userToSeqFilter = require("../utility/filter.js");

const getAllProducts = async (req, res, next) => {
  // Converting user filter to sequelize filter
  const filters = userToSeqFilter(req.query);

  const { page = 1, limit = 0 } = req.query;
  const offset = (+page - 1) * +limit;

  const products = await Product.findAll({
    raw: true,
    attributes: {
      exclude: ["description", "brand", "quantity", "CategoryId"],
      include: [[col("Category.name"), "category"]],
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
      ["createdAt", "DESC"],
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
      include: [[col("Category.name"), "category"]],
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
