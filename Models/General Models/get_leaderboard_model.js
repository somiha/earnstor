const DB = require("../../Utils/db_connection");

module.exports = class LeaderBoardModel {
  static GetLeaderBoard() {
    return DB.execute("SELECT * FROM users ORDER BY point DESC");
  }
};
