const { StatusCodes } = require("http-status-codes");
const CustomApiError = require("./custom.js");

class BadRequest extends CustomApiError {
  constructor(message) {
    super(message, StatusCodes.BAD_REQUEST);
  }
}

module.exports = BadRequest;
