const { DataTypes } = require("sequelize");

const sequelize = require("../DB/connect.js");

const Category = require("./category.js");

const Customer = require("./customer.js");

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
      type: DataTypes.STRING(500),
      allowNull: false,
      validate: {
        len: [5, 500],
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
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    images: {
      type: DataTypes.STRING,
      allowNull: false,
      get() {
        return this.getDataValue("images").split(";");
      },
      set(val) {
        this.setDataValue("images", val.join(";"));
      },
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

Customer.hasMany(Product, { as: "Seller", foreignKey: "SellerId" });
Product.belongsTo(Customer, { as: "Seller", foreignKey: "SellerId" });

Product.sync();

module.exports = Product;
