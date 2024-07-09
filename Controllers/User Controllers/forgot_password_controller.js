const forgotPasswordModel = require("../../Models/User Models/forgot_pass_model");
exports.forgot_password = async (req, res) => {
  let mobile = req.body.mobile;
  let new_password = req.body.new_password;
  let confirm_password = req.body.confirm_password;

  forgotPasswordModel.checkOldPass(mobile).then((result) => {
    if (result[0].length < 1) {
      let data = {
        status: "Failed",
        messege: "No user found with this credentials",
      };
      res.status(400).json(data);
    } else if (new_password != confirm_password) {
      let data = {
        status: "Failed",
        messege: "Password didn't match",
      };
      res.status(400).json(data);
    } else {
      forgotPasswordModel
        .changePassword(mobile, new_password)
        .then((result) => {
          let data = {
            status: "Success",
            messege: "Password changed successfully",
          };
          res.status(200).json(data);
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json({ msg: "Internal Server Error" });
        });
    }
  });
};
