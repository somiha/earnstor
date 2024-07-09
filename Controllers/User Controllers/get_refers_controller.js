const getUserModel = require("../../Models/User Models/get_user_model");
const GetRefersModel = require("../../Models/User Models/get_refers_model");
exports.GetRefers = (req, res, next) => {
  let userId = req.query.userId;
  getUserModel
    .getUserByID(userId)
    .then((result1) => {
      GetRefersModel.GetAllRefers(result1[0][0].my_refer_code)
        .then((result2) => {
          let data = {
            status: "Success",
            messege: "Refers given Below",
            user: result1[0][0],
            refers: result2[0],
          };
          res.status(200).json(data);
        })
        .catch((error) => {
          res.status(400).json("Something is wrong");
        });
    })
    .catch((error) => {
      res.status(400).json("Something is wrong");
    });
};
