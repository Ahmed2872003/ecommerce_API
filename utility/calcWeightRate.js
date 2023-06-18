const calcWeightRate = async (rateTable) => {
  let totalWeight = 0;
  let numerator = 0;
  let comulativeRate = 0;
  for (let i = 0; i < rateTable.length; i++) {
    const { rating, weight } = rateTable[i].dataValues;

    numerator += rating * weight;
    totalWeight += weight;
  }
  comulativeRate = numerator / totalWeight;

  comulativeRate = String(comulativeRate);

  if (+comulativeRate[2] >= 5) return Math.floor(+comulativeRate) + 0.5;
  else return +comulativeRate[0];
};

module.exports = calcWeightRate;
