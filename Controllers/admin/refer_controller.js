const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");

exports.getRefers = async (req, res, next) => {
  try {
    // console.log(req.query.mobile);
    // changed
    referCode = req.query.referCode;
    const userQuery = `SELECT * FROM users WHERE refercode = ?`;
    const users = await queryAsync(userQuery, [referCode]);
    console.log(users);

    const page = parseInt(req.query.page) || 1;
    const usersPerPage = 8;
    const startIdx = (page - 1) * usersPerPage;
    const endIdx = startIdx + usersPerPage;
    const paginatedUsers = users.slice(startIdx, endIdx);
    return res.status(200).render("pages/refer", {
      title: "Refers",
      users,
      paginatedUsers,
      usersPerPage,
      page,
    });
  } catch (e) {
    console.log(e);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};
