const DB = require("../../Utils/db_connection");
module.exports = class GetRefersModel {
  static GetAllRefers(referCode) {
    return DB.execute(
      "SELECT * FROM users WHERE refercode = '" +
        referCode +
        "' AND is_verified = 1 AND is_payment_verified = 1"
    );
  }
};
