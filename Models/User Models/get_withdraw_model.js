const DB = require("../../Utils/db_connection");

module.exports = class GetWithdraw {
  static GetWithdraw(userID) {
    return DB.execute("SELECT * FROM withdraw WHERE userid = '" + userID + "'");
  }
};
