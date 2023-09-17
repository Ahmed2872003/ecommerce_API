const path = require("path");

function imageValidation(file) {
  const validExt = /jpg|png|jpeg/i;

  const isValidExt = validExt.test(path.extname(file.originalname));

  const isValidMime = validExt.test(file.mimetype);

  if (isValidExt && isValidMime) return true;

  return false;
}

module.exports = imageValidation;
