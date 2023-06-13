const product = require("../sql/product.js");

const getAllProducts = async (req, res, next) => {
  let { query: filters } = req;

  const products = await product.find(filters);

  res.status(200).json({ data: products, length: products.length });
};

const getProduct = async (req, res, next) => {
  const { id } = req.params;

  const result = await product.findById(id);

  if (!result.length) {
    res.status(200).json({ msg: `No Product is found with id: ${id}` });
    return;
  }
  res.status(200).json({ data: result });
};

module.exports = { getAllProducts, getProduct };
