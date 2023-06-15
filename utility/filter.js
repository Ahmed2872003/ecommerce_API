const { Op, Sequelize } = require("sequelize");

const userToSeqFilter = (filter) => {
  let res = [];

  const { name, minPrice, maxPrice, minRating, maxRating, category } = filter;

  if (name) res.push({ name: { [Op.like]: `%${name}%` } });

  if (category)
    res.push(Sequelize.literal(`Category.name LIKE '%${category}%'`));

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

  return res;
};

module.exports = userToSeqFilter;
