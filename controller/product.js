const Product = require("../model/product.js");
const { Sequelize, Op } = require("sequelize");
const Category = require("../model/category.js");
const sequelize = require("../DB/connect.js");
const userToSeqFilter = require("../utility/filter.js");

const getAllProducts = async (req, res, next) => {
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

  res.status(200).json({ data: result });
};

module.exports = { getAllProducts, getProduct };
