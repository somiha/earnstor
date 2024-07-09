const DB = require("../../Utils/db_connection");
module.exports = class AddWithdrawModel {
  static AddWithdraw(userid, day, date, amount) {
    return DB.execute(
      "INSERT INTO withdraw(userid, day, date, amount) VALUES (?, ?, ?, ?)",
      [userid, day, date, amount]
    );
  }
};
