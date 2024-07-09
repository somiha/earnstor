const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");

exports.getRecharge = async (req, res, next) => {
  try {
    const userQuery = `SELECT recharge.*, users.name AS name, operator.name AS operator_name
FROM recharge
LEFT JOIN users ON recharge.user_id = users.userid
LEFT JOIN operator ON recharge.operator_id = operator.id;`;

    const recharge = await queryAsyncWithoutValue(userQuery);

    const page = parseInt(req.query.page) || 1;
    const rechargePerPage = 8;
    const startIdx = (page - 1) * rechargePerPage;
    const endIdx = startIdx + rechargePerPage;
    const paginatedrecharge = recharge.slice(startIdx, endIdx);
    // console.log(paginatedrecharge);
    return res.status(200).render("pages/recharge", {
      title: "All recharge",
      recharge,
      paginatedrecharge,
      rechargePerPage,
      page,
    });
  } catch (e) {
    console.log(e);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.updateRechargeStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updateQuery = "UPDATE recharge SET status = ? WHERE id = ?";
    await db.execute(updateQuery, [status, id]);

    res.redirect("/recharge-history");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
