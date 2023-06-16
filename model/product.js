const { DataTypes } = require("sequelize");

const sequelize = require("../DB/connect.js");

const Category = require("./category.js");

const Product = sequelize.define(
  "Product",
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

    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, 150],
      },
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: "USA",
    },
  },
  { timestamps: true }
);

Category.hasMany(Product);
Product.belongsTo(Category);

Product.sync();

module.exports = Product;