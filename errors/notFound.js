const { StatusCodes } = require("http-status-codes");
const CustomApiError = require("./custom.js");

class NotFoundError extends CustomApiError {
  constructor(field, id) {
    super(`No ${field} found with id: ${id}`, StatusCodes.NOT_FOUND);
  }
}

module.exports = NotFoundError;
