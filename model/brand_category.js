const { DataTypes } = require("sequelize");

const sequelize = require("../DB/connect.js");

const Brand = require("./brand.js");
const Category = require("./category.js");

const brandCategoryData = require("../brandCategory.json");

const BrandCategory = sequelize.define(
  "brandCategory",
  {},
  { timestamps: false }
);

Brand.belongsToMany(Category, { through: BrandCategory });
Category.belongsToMany(Brand, { through: BrandCategory });

BrandCategory.belongsTo(Category);
BrandCategory.belongsTo(Brand);

(async () => {
  await BrandCategory.sync();

  const brandCategory = await BrandCategory.findOne();

  if (brandCategory) return;

  await BrandCategory.bulkCreate(brandCategoryData);
})();

module.exports = BrandCategory;
