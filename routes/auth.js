const router = require("express").Router();

const {
  signup,
  login,
  resetPass,
  confEmail,
  logout,
  checkToken,
} = require("../controller/auth.js");

router.post("/signup", signup);

router.post("/login", login);

router.get("/logout", logout);

router.get("/check-token", checkToken);

router.post("/reset/password/:token", resetPass);

router.get("/confirm/email/:token", confEmail);

module.exports = router;
