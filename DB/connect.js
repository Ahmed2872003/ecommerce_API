const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  host: "wec.h.filess.io",
  database: "Ecommerce_machinery",
  username: "Ecommerce_machinery",
  password: process.env.DB_PASS,
  dialect: "mysql",
  logging: false,
  port: 3307,
  pool: {
    max: 3,
    idle: 160000,
    evict: 180000,
    acquire: 160000,
  },
});

module.exports = sequelize;
