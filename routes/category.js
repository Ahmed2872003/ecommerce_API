const router = require("express").Router();

const { getAllCategories } = require("../controller/category");
const { getCategoryBrands } = require("../controller/categoryBrand");

router.get("/", getAllCategories);

router.get("/brands", getCategoryBrands);

module.exports = router;
