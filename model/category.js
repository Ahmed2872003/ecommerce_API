const { DataTypes } = require("sequelize");

const sequelize = require("../DB/connect.js");

const categoriesData = require("../categories.json");

const Category = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: false }
);

(async () => {
  await Category.sync();
  const category = await Category.findOne();

  if (category) return;

  await Category.bulkCreate(categoriesData);
})();

module.exports = Category;
