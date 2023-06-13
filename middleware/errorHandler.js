const errorHandler = (err, req, res, next) => {
  const customError = {
    statusCode: err.statusCode || 500,
    msg: err.message,
  };
  res.status(customError.statusCode).json({ msg: err.message });
};

module.exports = errorHandler;
