const AddWithdrawModel = require("../../Models/User Models/add_withdraw_model");
exports.AddWithdraw = (req, res, next) => {
  let userID = req.query.userid;
  let day = req.body.day;
  let date = req.body.date;
  let amount = req.body.amount;
  AddWithdrawModel.AddWithdraw(userID, day, date, amount)
    .then((result) => {
      let data = {
        status: "Success",
        messege: "Withdraw request sended",
      };
      res.status(200).json(data);
    })
    .catch((error) => {
      console.log(error);
    });
};
