const sequelize = require("../DB/connect.js");
const { DataTypes, Model } = require("sequelize");

const Product = require("./product.js");
const Customer = require("./customer.js");

const Review = sequelize.define(
  "Review",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 200],
      },
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
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
    CustomerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Customer,
        key: "id",
      },
    },
  },
  { indexes: [{ unique: true, fields: ["ProductId", "CustomerId"] }] }
);

Product.hasMany(Review, { onDelete: "cascade" });
Customer.hasMany(Review);

Review.belongsTo(Product);
Review.belongsTo(Customer);

Review.sync();

module.exports = Review;
