const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  dialect: "mysql",
  logging: false,
  port: process.env.DB_PORT,
  pool: { max: 3, idle: 160000, evict: 180000, acquire: 160000 },
});

module.exports = sequelize;
