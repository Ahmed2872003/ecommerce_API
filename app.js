require("express-async-errors");

require("dotenv").config();

const express = require("express");

const app = express();

const port = process.env.PORT || 5000;

// db connection
const connection = require("./DB/connect");

connection.connect(function (err) {
  if (err) console.log("Can't connect to database.");
  else {
    app.listen(port, () => console.log(`API is listening on port ${port}.`));
  }
});
