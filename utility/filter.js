const { Op, Sequelize } = require("sequelize");

const userToSeqFilter = (filter) => {
  let res = [];

  if (!filter) return res;

  const seqOperator = {
    "=": Op.eq,
    "!=": Op.ne,
    ">": Op.gt,
    ">=": Op.gte,
    "<": Op.lt,
    "<=": Op.lte,
    "like=": Op.like,
    "nlike=": Op.notLike,
  };

  const filterRegExp = /(like|nlike)*=|!=|(>|<)=*/g;

  filter = filter.replaceAll(/%3E|%3C/g, (match) =>
    match === "%3E" ? ">" : "<"
  );

  filter = filter
    .replaceAll(filterRegExp, (match) => " " + match + " ")
    .split("&");

  filter.forEach((element) => {
    let [key, op, val] = element.split(" ");

    if (key === "category") key = "$Category.name$";

    if (op === "like=" || op === "nlike=") val = "%" + val + "%";

    if (key !== "limit" && key !== "page")
      res.push({ [key]: { [seqOperator[op]]: val } });
  });

  return res;
};

// if (minPrice && maxPrice)
//   res.push({ price: { [Op.between]: [minPrice, maxPrice] } });
// else {
//   if (minPrice) res.push({ price: { [Op.gte]: minPrice } });
//   if (maxPrice) res.push({ price: { [Op.lte]: maxPrice } });
// }

// if (minRating && maxRating)
//   res.push({ rating: { [Op.between]: [minRating, maxRating] } });
// else {
//   if (minRating) res.push({ rating: { [Op.gte]: minRating } });
//   if (maxRating) res.push({ rating: { [Op.lte]: maxRating } });
// }

// if (sellerId) res.push({ SellerId: sellerId });

module.exports = userToSeqFilter;
