const router = require("express").Router();

const { getAllProducts, getProduct } = require("../controller/product.js");

router.get("/", getAllProducts);
router.get("/:id", getProduct);

module.exports = router;
