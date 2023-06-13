const mysql = require("mysql");
const util = require("util");

class Db {
  constructor(host, user, password, database) {
    this.connection = mysql.createConnection({
      host,
      user,
      password,
      database,
    });
  }

  connect() {
    return new Promise((res, rej) => {
      this.connection.connect((err) => {
        if (err) rej(err);
        else res("Connected");
      });
    });
  }
}
const db = new Db("localhost", "root", process.env.DB_PASS, "ecommerce");

const query = util.promisify(db.connection.query).bind(db.connection);

module.exports = { db, query };
