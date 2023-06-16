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
      customError.msg = `${error["type"]}: ${error["path"]} must be from ${error["validatorArgs"][0]} to ${error["validatorArgs"][1]} length`;
    }
    // notNull constraint error
    else if (error["validatorKey"] === "is_null")
      customError.msg = `${error["type"]}: ${error["path"]} field can't be empty`;
    else if (error["validatorKey"] === "not_unique")
      customError.msg = `this ${error["path"]} already exists`;

    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  res.status(customError.statusCode).json({ msg: customError.msg });
  // res.status(customError.statusCode).json(err);
};

module.exports = errorHandler;
