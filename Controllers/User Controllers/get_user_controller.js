const getUserModel = require("../../Models/User Models/get_user_model");
exports.GetUser = (req, res, next) => {
  let userId = req.query.userId;
  getUserModel
    .getUserByID(userId)
    .then((result) => {
      let data = {
        status: "Success",
        messege: "User Give Below",
        user: result[0].length < 1 ? {} : result[0][0],
      };
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(400).json("Something is wrong");
    });
};
