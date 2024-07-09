const payment_model = require("../../Models/User Models/payment_model");

exports.add_payment = async (req, res, next) => {
  try {
    let userId = req.query.user_id;
    let transactionId = req.body.transaction_id;
    let mobileNumber = req.body.mobile_number;
    let amount = req.body.amount;
    let operator = req.body.operator;

    payment_model
      .addPayment(mobileNumber, transactionId, operator, amount, userId)
      .then((result) => {
        let data = {
          status: "Success",
          messege: "Payment added successfully",
        };
        res.status(200).json(data);
      });
  } catch (e) {
    console.log(e);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};
