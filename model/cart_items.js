const sequelize = require("../DB/connect.js");

const { DataTypes } = require("sequelize");

const Cart = require("./cart.js");
const Product = require("./product.js");

const CartItem = sequelize.define(
  "CartItem",
  {
    CartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Cart,
        key: "id",
      },
    },
    ProductId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
  },
  {
    indexes: [{ unique: true, fields: ["CartId", "ProductId"] }],
    timestamps: false,
  }
);

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

CartItem.sync();

module.exports = CartItem;
