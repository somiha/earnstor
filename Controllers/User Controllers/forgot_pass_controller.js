const forgotPasswordModel = require("../../Models/User Models/forgot_pass_model");
exports.ForgotPassword = (req, res, next) => {
  let mobile = req.body.mobile;
  let oldPass = req.body.oldPass;
  let newPass = req.body.newPass;
  forgotPasswordModel
    .checkOldPass(mobile)
    .then((result) => {
      if (result[0][0].password == oldPass) {
        forgotPasswordModel
          .changePassword(mobile, newPass)
          .then((result) => {
            let data = {
              status: "Success",
              messege: "Password changed successfully",
            };
            res.status(200).json(data);
          })
          .catch((error) => {});
      } else {
        let data = {
          status: "Failed",
          messege: "Old password didn't match",
        };
        res.status(400).json(data);
      }
    })
    .catch((error) => {});
};
