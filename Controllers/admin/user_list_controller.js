const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");

exports.getAllUsers = async (req, res, next) => {
  try {
    const userQuery = `SELECT * FROM users`;
    const users = await queryAsyncWithoutValue(userQuery);

    const page = parseInt(req.query.page) || 1;
    const usersPerPage = 8;
    const startIdx = (page - 1) * usersPerPage;
    const endIdx = startIdx + usersPerPage;
    const paginatedUsers = users.slice(startIdx, endIdx);
    return res.status(200).render("pages/allUsers", {
      title: "All Users",
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

exports.deleteUser = async (req, res, next) => {
  try {
    console.log(req.query);
    const userId = req.query.id;

    const deleteQuery = "DELETE FROM users WHERE userid = ?";
    const values = [userId];

    await queryAsync(deleteQuery, values);

    return res.redirect("/");
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
