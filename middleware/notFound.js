const notFound = async (req, res, next) => {
  res.send("Not found");
};

module.exports = notFound;
