const router = require("express").Router();

const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
} = require("../controller/product.js");

const auth = require("../middleware/authorization.js");

const isSeller = require("../middleware/isSeller.js");

router.get("/", getAllProducts);
router.get("/:id", getProduct);

router.use("/", auth, isSeller);

router.route("/").post(createProduct);

router.route("/:productId").patch(updateProduct);

module.exports = router;
