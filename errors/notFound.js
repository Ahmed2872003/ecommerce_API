const { StatusCodes } = require("http-status-codes");
const CustomApiError = require("./custom.js");

class NotFoundError extends CustomApiError {
  constructor(message, id) {
    super(message, StatusCodes.NOT_FOUND);
  }
}

module.exports = NotFoundError;
