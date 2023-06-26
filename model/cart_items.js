const sequelize = require("../DB/connect.js");

const { DataTypes } = require("sequelize");

const Cart = require("./cart.js");
const Product = require("./product.js");

const CartItem = sequelize.define(
  "CartItem",
  {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
  },
  {
    timestamps: false,
  }
);

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

CartItem.sync();

module.exports = CartItem;
