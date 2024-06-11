const router = require("express").Router();

const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getRelatedBrands,
} = require("../controller/product.js");

const upload = require("../middleware/multer.js");

const auth = require("../middleware/authorization.js");

const isSeller = require("../middleware/isSeller.js");

router.get("/", getAllProducts);

router.get("/brands", getRelatedBrands);

router.get("/:id", getProduct);

router.use("/", auth, isSeller);

router.use(
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "image", maxCount: 1 },
  ])
);
router.post("/", createProduct);

router.route("/:productId").patch(updateProduct).delete(deleteProduct);

module.exports = router;
