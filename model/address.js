const sequelize = require("../DB/connect.js");
const { DataTypes } = require("sequelize");

const Address = sequelize.define("Address", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNullL: false,
    autoIncrement: true,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  line1: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  line2: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  postal_code: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  province: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Address.sync();

module.exports = Address;
