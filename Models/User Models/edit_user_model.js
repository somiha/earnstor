const DB = require("../../Utils/db_connection");

module.exports = class EditUser {
  static checkUser(userId) {
    return DB.execute("SELECT * FROM users WHERE userid = '" + userId + "'");
  }

  static changeInfo(userId, name, email, mobile) {
    return DB.execute(
      "UPDATE users SET name = '" +
        name +
        "', email = '" +
        email +
        "',  mobile = '" +
        mobile +
        "' WHERE userid = '" +
        userId +
        "'"
    );
  }
};
