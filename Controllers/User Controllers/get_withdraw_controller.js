const GetWithdrawModel = require("../../Models/User Models/get_withdraw_model");
exports.GetWithdraw = (req, res, next) => {
  let userid = req.query.userid;
  GetWithdrawModel.GetWithdraw(userid)
    .then((result) => {
      let data = {
        status: "Success",
        messege: "Withdraw history given bolow",
        withdraw: result[0],
      };
      res.status(200).json(data);
    })
    .catch((error) => {
      console.log(error);
    });
};
