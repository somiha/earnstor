const editModel = require("../../Models/User Models/edit_user_model");
exports.EditUser = (req, res, next) => {
  let userId = req.query.userId;
  let name = req.body.name;
  let email = req.body.email;
  let mobile = req.body.mobile;
  editModel.checkUser(userId).then((result) => {
    if (result[0].length < 1) {
      let data = {
        status: "Failed",
        messege: "No user found",
      };
      res.status(400).json(data);
    } else {
      editModel
        .changeInfo(userId, name, email, mobile)
        .then((result2) => {
          let data = {
            status: "Success",
            messege: "User Info Changed",
          };
          res.status(200).json(data);
        })
        .catch((error) => {
          res.status(400).json("Something is wrong");
        });
    }
  });
};
