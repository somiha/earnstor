// const DB = require("../../Utils/db_connection");
// module.exports = class GetUserModel {
//   static getUserByID(userId) {
//     const res = DB.execute(
//       "SELECT * FROM users WHERE userid = '" + userId + "'"
//     );
//     console.log("hi", res);
//     return DB.execute("SELECT * FROM users WHERE userid = '" + userId + "'");
//   }

//   static getUserByMobile(mobile) {
//     const res = DB.execute(
//       "SELECT * FROM users WHERE mobile = '" + mobile + "'"
//     );
//     console.log("hi", res);
//     return DB.execute("SELECT * FROM users WHERE mobile = '" + mobile + "'");
//   }
// };

const DB = require("../../Utils/db_connection");
module.exports = class GetUserModel {
  static getUserByID(userId) {
    const res = DB.execute(
      " SELECT u.*,  c.name as country_name FROM users u INNER JOIN country c ON u.country = c.id WHERE u.userid = '" +
        userId +
        "'"
    );
    console.log("hi", res);
    return DB.execute(
      "SELECT u.*, c.name as country_name FROM users u INNER JOIN country c ON u.country = c.id WHERE u.userid = '" +
        userId +
        "'"
    );
  }

  static getUserByMobile(mobile) {
    const res = DB.execute(
      "SELECT u.*, c.name FROM users u INNER JOIN country c ON u.country = c.id WHERE u.mobile = '" +
        mobile +
        "'"
    );
    console.log("hi", res);
    return DB.execute(
      "SELECT u.*, c.name FROM users u INNER JOIN country c ON u.country = c.id WHERE u.mobile = '" +
        mobile +
        "'"
    );
  }
};
