const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "Ecommerce_machinery",
  "Ecommerce_machinery",
  process.env.DB_PASS,
  {
    host: "wec.h.filess.io",
    dialect: "mysql",
    logging: false,
    port: 3307,
    pool: {
      max: 3,
    },
  }
);

// const sequelize = new Sequelize("ecommerce", "root", "Falcon2025adam1", {
//   host: "localhost",
//   dialect: "mysql",
//   logging: false,
// });

module.exports = sequelize;
