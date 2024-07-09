const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "earnstor",
  password: "12345678",
  // port: 3307,
});

// const pool = mysql.createPool({
//   host: "103.29.180.66",
//   user: "earnways_somiha",
//   database: "earnways_main",
//   password: "_)(QxaST}p%U",
// });

module.exports = pool.promise();
