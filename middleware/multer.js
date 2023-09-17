const multer = require("multer");
const BadRequestErr = require("../errors/badRequest");
const imageValidation = require("../utility/imageValidation");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1000000,
  },
  fileFilter: (req, file, cb) => {
    if (imageValidation(file)) cb(null, true);
    else cb(new BadRequestErr("Provide only images"), false);
  },
});

module.exports = upload;
