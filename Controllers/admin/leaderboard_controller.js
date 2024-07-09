const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");

exports.getLeaderBoard = async (req, res, next) => {
  try {
    const userQuery = `SELECT * FROM users ORDER BY point DESC`;
    const users = await queryAsyncWithoutValue(userQuery);

    const page = parseInt(req.query.page) || 1;
    const usersPerPage = 8;
    const startIdx = (page - 1) * usersPerPage;
    const endIdx = startIdx + usersPerPage;
    const paginatedUsers = users.slice(startIdx, endIdx);
    return res.status(200).render("pages/leaderboard", {
      title: "leaderboard",
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
