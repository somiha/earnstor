const DB = require("../../Utils/db_connection");
module.exports = class AddPointModel {
  static SelectPoint(userID) {
    return DB.execute(
      "SELECT point FROM users WHERE userid = '" + userID + "'"
    );
  }
  static AddPoint(result, userID, point) {
    const currentPoint = result[0][0].point;
    const newPoints = parseInt(currentPoint + point);
    return DB.execute("UPDATE users SET point = ? WHERE userid = ?", [
      newPoints,
      userID,
    ]);
  }

  static AddEarnHistory(userID, point, typeID) {
    return DB.execute(
      "INSERT INTO earn_history (user_id, point, type_id) VALUES (?, ?, ?)",
      [userID, point, typeID]
    );
  }
};
