const DB = require("../../Utils/db_connection");

module.exports = class EditUser {
  static checkUser(userId) {
    return DB.execute("SELECT * FROM users WHERE userid = '" + userId + "'");
  }

  static changeInfo(userId, is_verified) {
    return DB.execute(
      "UPDATE users SET is_verified = '" +
        is_verified +
        "' WHERE userid = '" +
        userId +
        "'"
    );
  }
};
