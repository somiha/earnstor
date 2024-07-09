const DB = require("../../Utils/db_connection");
module.exports = class EditGeneralModel {
  static EditGeneralInfo(headline, point, min_withdraw, id) {
    let query = "UPDATE general SET ";
    let params = [];

    if (headline) {
      query += "headline = ?, ";
      params.push(headline);
    }

    if (point) {
      query += "point = ?, ";
      params.push(point);
    }

    if (min_withdraw) {
      query += "min_withdraw = ?, ";
      params.push(min_withdraw);
    }

    // Remove the last comma and space
    query = query.slice(0, -2);

    query += " WHERE id = ?";
    params.push(id);

    return DB.execute(query, params);
  }
};
