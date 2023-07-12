const { Op, Sequelize } = require("sequelize");

const userToSeqFilter = (filter) => {
  let res = [];

  const {
    name,
    minPrice,
    maxPrice,
    minRating,
    maxRating,
    category,
    sellerId,
    currency,
  } = filter;

  if (name) res.push({ name: { [Op.like]: `%${name}%` } });

  if (category) res.push({ "$Category.name$": { [Op.like]: `%${category}%` } });

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

  if (currency) res.push({ currency: { [Op.like]: `%${currency}%` } });

  return res;
};

module.exports = userToSeqFilter;
