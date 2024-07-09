const loginModel = require("../../Models/User Models/login_model");
exports.Login = (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;
  loginModel.checkUser(email).then((result) => {
    if (result[0].length < 1) {
      let data = {
        status: "Failed",
        messege: "No user found with this credentials",
        user: {},
      };
      res.status(400).json(data);
    } else {
      if (result[0][0].password == password) {
        let data = {
          status: "Success",
          messege: "User info given below",
          user: result[0][0],
        };
        res.status(200).json(data);
      } else {
        let data = {
          status: "Failed",
          messege: "Invalid password",
          user: {},
        };
        res.status(400).json(data);
      }
    }
  });
};
