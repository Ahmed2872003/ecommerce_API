const router = require("express").Router();

const {
  getAllProducts,
  getProduct,
  createProduct,
} = require("../controller/product.js");

const auth = require("../middleware/authorization.js");

const isSeller = require("../middleware/isSeller.js");

router.get("/", getAllProducts);
router.get("/:id", getProduct);

router.use("/", auth);

router.route("/").post(isSeller, createProduct);

module.exports = router;
