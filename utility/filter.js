const { Op, Sequelize } = require("sequelize");

const userToSeqFilter = (filter) => {
  let res = [];

  const { minPrice, maxPrice, minRating, maxRating, sellerId } = filter;

  likeRegExp = /name|category|currency|brand/i;

  for (const key in filter) {
    let sequelizeKey = null;
    if (likeRegExp.test(key)) {
      if (key === "category") sequelizeKey = "$Category.name$";
      else sequelizeKey = key;

      res.push({ [sequelizeKey]: { [Op.like]: `%${filter[key]}%` } });
    }
  }

  if (minPrice && maxPrice)
    res.push({ price: { [Op.between]: [minPrice, maxPrice] } });
  else {
    if (minPrice) res.push({ price: { [Op.gte]: minPrice } });
    if (maxPrice) res.push({ price: { [Op.lte]: maxPrice } });
  }

  if (minRating && maxRating)
    res.push({ rating: { [Op.between]: [minRating, maxRating] } });
  else {
    if (minRating) res.push({ rating: { [Op.gte]: minRating } });
    if (maxRating) res.push({ rating: { [Op.lte]: maxRating } });
  }

  if (sellerId) res.push({ SellerId: sellerId });

  return res;
};

module.exports = userToSeqFilter;
