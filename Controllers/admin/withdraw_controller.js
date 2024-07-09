const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");

exports.getWithdraw = async (req, res, next) => {
  try {
    const userQuery = `SELECT withdraw.*, users.name as name FROM withdraw LEFT JOIN users ON withdraw.userid = users.userid`;

    const withdraw = await queryAsyncWithoutValue(userQuery);

    const page = parseInt(req.query.page) || 1;
    const withdrawPerPage = 8;
    const startIdx = (page - 1) * withdrawPerPage;
    const endIdx = startIdx + withdrawPerPage;
    const paginatedWithdraw = withdraw.slice(startIdx, endIdx);
    // console.log(paginatedWithdraw);
    return res.status(200).render("pages/withdraw", {
      title: "All withdraw",
      withdraw,
      paginatedWithdraw,
      withdrawPerPage,
      page,
    });
  } catch (e) {
    console.log(e);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updateQuery = "UPDATE withdraw SET status = ? WHERE id = ?";
    await db.execute(updateQuery, [status, id]);

    res.redirect("/withdraw-history");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
