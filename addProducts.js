const Product = require("./model/product.js");

const products = require("./products.json");

products.forEach(async (product) => {
  delete product.id;
  try {
    await Product.create(product);
  } catch (err) {
    console.log(err.message);
  }
});
