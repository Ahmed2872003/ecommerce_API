const calcWeightRate = async (rateTable) => {
  let totalWeight = 0;
  let numerator = 0;
  let comulativeRate = 0;
  for (let i = 0; i < rateTable.length; i++) {
    const { rating, weight } = rateTable[i].dataValues;

    numerator += rating * weight;
    totalWeight += weight;
  }
  comulativeRate = numerator / (totalWeight || 1);

  return comulativeRate.toFixed(1);
};

module.exports = calcWeightRate;
