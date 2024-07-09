const DB = require("../../Utils/db_connection");
module.exports = class UserImage {
  static checkUser(userId) {
    return DB.execute("SELECT * FROM users WHERE userid = '" + userId + "'");
  }
  static setImage(userId, imageUrl) {
    return DB.execute(
      "UPDATE users SET imageUrl = '" +
        imageUrl +
        "' WHERE userid = '" +
        userId +
        "'"
    );
  }
};
