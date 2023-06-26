const { StatusCodes } = require("http-status-codes");

const CustomAPIError = require("../errors/custom");

const JWT = require("jsonwebtoken");

const authorization = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer "))
    throw new CustomAPIError(
      "You aren't allowed to get that resource",
      StatusCodes.UNAUTHORIZED
    );

  try {
    const token = authorization.split(" ")[1];
    const payload = JWT.verify(token, process.env.JWT_SECRET_KEY);
    req.customerId = payload.id;
    next();
  } catch (err) {
    throw new CustomAPIError(
      "You aren't allowed to get that resource",
      StatusCodes.UNAUTHORIZED
    );
  }
};

module.exports = authorization;
