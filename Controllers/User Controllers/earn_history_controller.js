const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");

exports.getEarnHistory = async (req, res, next) => {
  try {
    let userID = req.query.userid;
    const getEarnHistoryQuery = `SELECT earn_history.*, type.type_name as type_name 
  FROM earn_history 
  LEFT JOIN type ON earn_history.type_id = type.id 
  WHERE earn_history.user_id = ?`;
    const earnHistory = await queryAsync(getEarnHistoryQuery, [userID]);

    return res.status(200).json({ earnHistory });
  } catch (err) {
    console.log(err);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};
