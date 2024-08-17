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

// const DB = require("../../Utils/db_connection");

// module.exports = class GetUserModel {
//   static getUserByID(userId) {
//     const res = DB.execute(
//       "SELECT u.*, c.name as country_name, l.name as user_level FROM users u LEFT JOIN country c ON u.country = c.id LEFT JOIN level l ON u.refers <= l.refer WHERE u.userid = '" +
//         userId +
//         "' ORDER BY l.refer ASC LIMIT 1"
//     );

//     return DB.execute(
//       "SELECT u.*, c.name as country_name, l.name as user_level FROM users u LEFT JOIN country c ON u.country = c.id LEFT JOIN level l ON u.refers <= l.refer WHERE u.userid = '" +
//         userId +
//         "' ORDER BY l.refer ASC LIMIT 1"
//     );
//   }

//   static getUserByMobile(mobile) {
//     const res = DB.execute(
//       "SELECT u.*, c.name as country_name, l.name as user_level FROM users u LEFT JOIN  country c ON u.country = c.id LEFT JOIN level l ON u.refers <= l.refer WHERE u.mobile = '" +
//         mobile +
//         "' ORDER BY l.refer ASC LIMIT 1"
//     );

//     return DB.execute(
//       "SELECT u.*, c.name as country_name, l.name as user_level FROM users u LEFT JOIN country c ON u.country = c.id LEFT JOIN level l ON u.refers <= l.refer WHERE u.mobile = '" +
//         mobile +
//         "' ORDER BY l.refer ASC LIMIT 1"
//     );
//   }
// };

const DB = require("../../Utils/db_connection");

module.exports = class GetUserModel {
  static async getUserByID(userId) {
    try {
      const result = await DB.execute(
        `SELECT 
           u.*, 
           c.name AS country_name,
           COALESCE(l.name, (SELECT name FROM level ORDER BY refer ASC LIMIT 1)) AS user_level
         FROM users u
         LEFT JOIN country c ON u.country = c.id
         LEFT JOIN level l ON u.refers >= l.refer
         WHERE u.userid = ?
         ORDER BY l.refer DESC
         LIMIT 1`,
        [userId]
      );
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  static async getUserByMobile(mobile) {
    try {
      const result = await DB.execute(
        `SELECT 
           u.*, 
           c.name AS country_name,
           COALESCE(l.name, (SELECT name FROM level ORDER BY refer ASC LIMIT 1)) AS user_level
         FROM users u
         LEFT JOIN country c ON u.country = c.id
         LEFT JOIN level l ON u.refers >= l.refer
         WHERE u.mobile = ?
         ORDER BY l.refer DESC
         LIMIT 1`,
        [mobile]
      );
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
};
