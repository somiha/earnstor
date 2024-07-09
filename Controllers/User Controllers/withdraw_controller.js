const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");

exports.add_withdraw = async (req, res, next) => {
  try {
    let userID = req.query.userid;
    let amount = req.body.amount;
    let number = req.body.number;
    let operator = req.body.operator;
    const userQuery = `SELECT * FROM users WHERE userid = ?`;

    const user = await queryAsync(userQuery, [userID]);
    const getPointsConversion = `SELECT point FROM point_conversion`;
    const pointsConversion = await queryAsyncWithoutValue(getPointsConversion);
    const min_withdraws = `SELECT min_withdraw FROM general`;
    const min_withdraw = await queryAsyncWithoutValue(min_withdraws);
    console.log(pointsConversion[0].point);
    if (!user[0]) {
      return res
        .status(400)
        .json({ status: false, msg: "No user found with this credentials" });
    }
    const points = user[0].point;
    const pointToBalance = points * pointsConversion[0].point;
    console.log(min_withdraw[0].min_withdraw);
    if (pointToBalance < min_withdraw[0].min_withdraw) {
      return res.status(400).json({
        status: false,
        msg: "Minimum balance for withdrawal is 50",
      });
    }

    if (amount > pointToBalance) {
      return res.status(400).json({
        status: false,
        msg: "Insufficient balance",
      });
    } else {
      const addWithdrawQuery = `INSERT INTO withdraw(userid, amount, number, operator) VALUES (?, ?, ?, ?)`;
      await queryAsync(addWithdrawQuery, [userID, amount, number, operator]);

      const newBalance = pointToBalance - amount;
      const newPoint = newBalance / pointsConversion[0].point;
      const updateBalanceQuery = `UPDATE users SET point = ? WHERE userid = ?`;
      await queryAsync(updateBalanceQuery, [newPoint, userID]);

      return res.status(200).json({
        msg: "Withdraw request sended",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};
