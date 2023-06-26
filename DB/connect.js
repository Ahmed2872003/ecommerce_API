const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("ecommerce", "root", process.env.DB_PASS, {
  host: "localhost",
  dialect: "mysql",
  // logging: false,
});

module.exports = sequelize;
