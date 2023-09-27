const router = require("express").Router();

const {
  signup,
  login,
  resetPass,
  confEmail,
} = require("../controller/auth.js");

router.post("/signup", signup);

router.post("/login", login);

router.post("/reset/password/:token", resetPass);

router.get("/confirm/email/:token", confEmail);

module.exports = router;
