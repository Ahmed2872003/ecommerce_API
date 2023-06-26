const customAPIError = require("../errors/custom.js");
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
    const validatorKey = error["validatorKey"];
    if (validatorKey === "len") {
      customError.msg = `${error["type"]}: ${error["path"]} must be from ${error["validatorArgs"][0]} to ${error["validatorArgs"][1]} length`;
      customError.statusCode = StatusCodes.BAD_REQUEST;
    }
    // notNull constraint error
    else if (validatorKey === "is_null") {
      customError.msg = `${error["type"]}: ${error["path"]} field can't be empty`;
      customError.statusCode = StatusCodes.BAD_REQUEST;
    } else if (validatorKey === "not_unique") {
      customError.msg = `this ${error["path"]} already exists`;
      customError.statusCode = StatusCodes.CONFLICT;
    } else if (validatorKey === "max" || validatorKey === "min") {
      customError.msg = `${error["path"]} ${validatorKey} value is ${error["validatorArgs"][0]}`;
      customError.statusCode = StatusCodes.BAD_REQUEST;
    }
  }

  res
    .status(customError.statusCode)
    .json({ msg: customError.msg.split(",")[0] });
  // res.status(customError.statusCode).json(err);
};

module.exports = errorHandler;
