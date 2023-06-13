const { query } = require("../DB/connect.js");

class product {
  static async find(filters) {
    let queryString = `SELECT pro.id,pro.name,price,image_url,rating FROM products AS pro INNER JOIN categories AS cate ON pro.category = cate.id\n`;

    if (filters) {
      filters = Object.entries(filters);

      if (filters.length) queryString += "WHERE";

      // Modify queryString to fit req queries
      filters.map(([key, val], index) => {
        if (key === "brand" || key === "name" || key === "category")
          queryString += ` ${
            key === "category" ? "cate.name" : `pro.${key}`
          } LIKE "%${val}%"`;
        else if (key === "minPrice" || key === "minRating")
          queryString += ` ${key.slice(3).toLowerCase()} >= ${val}`;
        else if (key === "maxPrice" || key === "maxRating")
          queryString += ` ${key.slice(3).toLowerCase()} <= ${val}`;
        if (index !== filters.length - 1) queryString += " AND";
      });
    }

    queryString += "\nORDER BY rating DESC";

    return await query(queryString);
  }

  static async findById(id) {
    if (!id) return [];

    const queryString = `
    SELECT pro.id,pro.name,description,price,quantity,image_url,cate.name as category,rating,brand,currency
    FROM products AS pro
    INNER JOIN categories AS cate 
    ON pro.category = cate.id
    WHERE pro.id = ${id}`;

    return await query(queryString);
  }
}

module.exports = product;
