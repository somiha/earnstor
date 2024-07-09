const DB = require("../../Utils/db_connection");

module.exports = class UserRegister {
  static checkUser(mobile) {
    return DB.execute("SELECT * FROM users WHERE mobile = '" + mobile + "'");
  }

  static isUserExistWithReferCode(referCode) {
    return DB.execute(
      "SELECT * FROM users WHERE my_refer_code = '" + referCode + "'"
    );
  }
  static userRegisterWithRefer(
    name,
    email,
    mobile,
    password,
    referCode,
    my_refer_code,
    verificationCode,
    premium,
    point,
    refers,
    is_verified,
    is_payment_verified,
    country
  ) {
    return DB.execute(
      "INSERT INTO users(name, email, mobile, password, refercode, my_refer_code, verification_code, premium, point, refers, is_verified, is_payment_verified, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        name,
        email,
        mobile,
        password,
        referCode,
        my_refer_code,
        verificationCode,
        premium,
        point,
        refers,
        is_verified,
        is_payment_verified,
        country,
      ]
    );
  }
  static userRegisterWithoutRefer(
    name,
    email,
    mobile,
    password,
    verificationCode,
    my_refer_code,
    premium,
    point,
    refers,
    is_verified,
    is_payment_verified,
    country
  ) {
    return DB.execute(
      "INSERT INTO users(name, email, mobile, password, verification_code, my_refer_code, premium, point, refers, is_verified, is_payment_verified, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        name,
        email,
        mobile,
        password,
        verificationCode,
        my_refer_code,
        premium,
        point,
        refers,
        is_verified,
        is_payment_verified,
        country,
      ]
    );
  }

  static increaseRefer(referCode) {
    return DB.execute(
      "UPDATE users SET refers = refers + 1 WHERE my_refer_code = " + referCode
    );
  }

  static checkIfUserExistWithReferCode(referCode) {
    return DB.execute(
      "SELECT * FROM users WHERE refercode = '" + referCode + "'"
    );
  }
};
