const sequelize = require("../DB/connect.js");
const { DataTypes, Model } = require("sequelize");

// Models
const Cutomer = require("../model/customer.js");
const Customer = require("../model/customer.js");

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    subtotal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    shipping_amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
      defaultValue: 0,
    },
    total_amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  { timestamps: true }
);

Order.belongsTo(Customer);
Customer.hasMany(Order);

Order.sync({ alter: true });

module.exports = Order;
