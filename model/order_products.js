const sequelize = require("../DB/connect.js");
const { DataTypes, Model } = require("sequelize");

//Models
const Order = require("../model/order.js");
const Product = require("../model/product.js");

const orderProduct = sequelize.define(
  "orderProduct",
  {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    pricePerItem: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
  },
  { timestamps: false }
);

Order.belongsToMany(Product, { through: orderProduct });
Product.belongsToMany(Order, { through: orderProduct });

orderProduct.belongsTo(Order, { onDelete: "CASCADE" });
orderProduct.belongsTo(Product);

orderProduct.sync();

module.exports = orderProduct;
