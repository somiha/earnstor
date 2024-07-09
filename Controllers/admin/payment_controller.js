const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");

exports.getAllPendingPayments = async (req, res, next) => {
  try {
    const paymentQuery = `SELECT * FROM payment WHERE payment_status = 'pending'`;
    const payments = await queryAsyncWithoutValue(paymentQuery);

    const page = parseInt(req.query.page) || 1;
    const paymentsPerPage = 8;
    const startIdx = (page - 1) * paymentsPerPage;
    const endIdx = startIdx + paymentsPerPage;
    const paginatedPayments = payments.slice(startIdx, endIdx);
    return res.status(200).render("pages/pendingPayment", {
      title: "All Pending Payment",
      payments,
      paginatedPayments,
      paymentsPerPage,
      page,
    });
  } catch (e) {
    console.log(e);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.acceptPayment = async (req, res, next) => {
  try {
    const paymentId = req.params.paymentId;
    const updatePaymentQuery = `UPDATE payment SET payment_status = 'accepted' WHERE payment_id = ?`;
    await queryAsync(updatePaymentQuery, [paymentId]);
    const userQuery = `SELECT user_id FROM payment WHERE payment_id = ?`;
    const user = await queryAsync(userQuery, [paymentId]);
    const userId = user[0].user_id;
    const updateUserQuery = `UPDATE users SET is_payment_verified = 1 WHERE userid = ?`;
    await queryAsync(updateUserQuery, [userId]);

    const userQuery1 = `SELECT * FROM users WHERE userid = ?`;
    const user1 = await queryAsync(userQuery1, [userId]);
    if (user1[0].refercode !== null) {
      console.log(user[0].refercode);
      const referCode = user1[0].refercode;
      const referUserQuery = `SELECT * FROM users WHERE my_refer_code = ?`;
      const referUser = await queryAsync(referUserQuery, [referCode]);
      console.log(referUser);
      const referUserId = referUser[0].userid;

      if (referUserId) {
        const referCountQuery = `UPDATE users SET refers = refers + 1 WHERE userid = ?`;
        await queryAsync(referCountQuery, [referUserId]);
      }
      const selectPoint = `SELECT * FROM type WHERE type_name = 'refer'`;
      const point = await queryAsyncWithoutValue(selectPoint);
      const earnHistoryQuery = `INSERT INTO earn_history (user_id, point, type_id) VALUES (?, ?, ?)`;
      await queryAsync(earnHistoryQuery, [
        referUserId,
        point[0].points,
        point[0].id,
      ]);
      const addPointQuery = `UPDATE users SET point = point + ? WHERE userid = ?`;
      await queryAsync(addPointQuery, [point[0].points, referUserId]);
    }

    return res.status(200).redirect("/pending-payment");
  } catch (e) {
    console.log(e);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.rejectPayment = async (req, res, next) => {
  try {
    const paymentId = req.params.paymentId;
    const updatePaymentQuery = `UPDATE payment SET payment_status = 'rejected' WHERE payment_id = ?`;
    await queryAsync(updatePaymentQuery, [paymentId]);
    return res.status(200).redirect("/pending-payment");
  } catch (e) {
    console.log(e);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};
