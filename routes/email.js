const router = require("express").Router();

const { sendEmailConf, sendPassReset } = require("../controller/email.js");

router.post("/confirm", sendEmailConf);

router.post("/reset/password", sendPassReset);

module.exports = router;
