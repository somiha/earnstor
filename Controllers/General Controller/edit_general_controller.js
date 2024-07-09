const EditGeneralInfoModel = require("../../Models/General Models/edit_general_model");
exports.EditGeneralInfo = (req, res, next) => {
  let headline = req.body.headline;
  let point = req.body.point;
  let min_withdraw = req.body.min_withdraw;
  EditGeneralInfoModel.EditGeneralInfo(headline, point, min_withdraw, 1)
    .then((result) => {
      let data = {
        status: "Success",
        messege: "General info edited",
      };
      res.status(200).json(data);
    })
    .catch((error) => {
      console.log(error);
    });
};
