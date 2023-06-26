const sequelize = require("../DB/connect.js");
const { DataTypes } = require("sequelize");

const Customer = require("./customer.js");

const Cart = sequelize.define(
  "Cart",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    CustomerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: Customer,
        key: "id",
      },
    },
    subtotal: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0,
    },
  },
  { timestamps: false }
);

Customer.hasOne(Cart);
Cart.belongsTo(Customer);

Cart.sync();

module.exports = Cart;
