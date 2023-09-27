const { StatusCodes } = require("http-status-codes");

const CustomAPIError = require("../errors/custom");

const JWT = require("jsonwebtoken");

const authorization = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token)
    throw new CustomAPIError(
      "You aren't allowed to get that resource",
      StatusCodes.UNAUTHORIZED
    );

  try {
    const payload = JWT.verify(token, process.env.JWT_SECRET_KEY);

    req.customer = { id: payload.id, seller: payload.seller };

    next();
  } catch (err) {
    console.log(err.message);
    throw new CustomAPIError(
      "You aren't allowed to get that resource",
      StatusCodes.UNAUTHORIZED
    );
  }
};

module.exports = authorization;
