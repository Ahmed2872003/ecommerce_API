const { StatusCodes } = require("http-status-codes");

const CustomAPIError = require("../errors/custom");

const JWT = require("jsonwebtoken");

const authorization = async (req, res, next) => {
  let token = req.headers.authorization;

  if (!token && !token.startsWith("Bearer"))
    throw new CustomAPIError(
      "You aren't allowed to get that resource",
      StatusCodes.UNAUTHORIZED
    );

  token = token.split(" ")[1];

  try {
    const payload = JWT.verify(token, process.env.JWT_SECRET_KEY);

    req.customer = { id: payload.id, seller: payload.seller };

    if (next) next();
  } catch (err) {
    console.log(err.message);
    throw new CustomAPIError(
      "You aren't allowed to get that resource",
      StatusCodes.UNAUTHORIZED
    );
  }
};

module.exports = authorization;
