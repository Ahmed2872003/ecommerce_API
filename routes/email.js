const router = require("express").Router();

const { sendEmailConf, confEmail } = require("../controller/email.js");

router.post("/confirmation", sendEmailConf);

router.get("/confirmation/:token", confEmail);

module.exports = router;
