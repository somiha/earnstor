const DB = require("../../Utils/db_connection");
module.exports = class ForgotPassword {
  static checkOldPass(mobile) {
    return DB.execute("SELECT * FROM users WHERE mobile = '" + mobile + "'");
  }
  static changePassword(mobile, newPass) {
    return DB.execute(
      "UPDATE users SET password = '" +
        newPass +
        "' WHERE mobile = '" +
        mobile +
        "'"
    );
  }
};
