const router = require("express").Router();

const {
  sendEmailConf,
  confEmail,
  sendPassReset,
  resetPass,
} = require("../controller/email.js");

router.post("/confirmation", sendEmailConf);
router.get("/confirmation/:token", confEmail);

router.post("/reset/password", sendPassReset);
router.post("/reset/password/:token", resetPass);

module.exports = router;
