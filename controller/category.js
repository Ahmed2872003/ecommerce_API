const Category = require("../model/category.js");

const getAllCategories = async (req, res) => {
  const categories = await Category.findAll();

  res.json({ data: categories });
};

module.exports = {
  getAllCategories,
};
