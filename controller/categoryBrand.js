const { col } = require("sequelize");
const Brand = require("../model/brand");
const CategoryBrand = require("../model/brand_category");
const Category = require("../model/category");

const getCategoryBrands = async (req, res) => {
  const categoryBrands = await Category.findAll({
    attributes: { include: [col("Brands.id"), col("Brands.name")] },
    include: [
      {
        model: Brand,
        required: true,
        attributes: [],
      },
    ],
    where: {
      id: req.body.categoryId,
    },
  });

  res.json({ data: categoryBrands });
};

module.exports = {
  getCategoryBrands,
};
