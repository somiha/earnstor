const DB = require("../../Utils/db_connection");

module.exports = class UserLogin {
  static checkUser(email) {
    return DB.execute("SELECT * FROM users WHERE email = '" + email + "'");
  }
};
