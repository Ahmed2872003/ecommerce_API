const customAPIError = require("../errors/customError.js");
const { StatusCodes } = require("http-status-codes");
const errorHandler = (err, req, res, next) => {
  const customError = {
    statusCode: err.statusCode || 500,
    msg: err.message,
  };
  // handle sequelize validations errors
  const { errors } = err;

  if (errors) {
    // len validation error
    const error = errors[0];
    if (error["validatorKey"] === "len") {
      customError.msg = `Validation error: ${error["path"]} must be from ${error["validatorArgs"][0]} to ${error["validatorArgs"][1]} characters`;
    }
    // notNull constraint error
    else if (error["validatorKey"] === "is_null") {
      customError.msg = `Validation error: ${error["path"]} field can't be empty`;
    }
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  res.status(customError.statusCode).json(customError.msg);
};

module.exports = errorHandler;
