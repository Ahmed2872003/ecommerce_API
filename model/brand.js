const { DataTypes } = require("sequelize");

const sequelize = require("../DB/connect.js");

const brandsData = require("../brands.json");

const Brand = sequelize.define(
  "Brand",
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

// Fill the table with predefined brands

(async () => {
  await Brand.sync();
  const brand = await Brand.findOne();

  if (brand) return;

  await Brand.bulkCreate(brandsData);
})();

module.exports = Brand;
