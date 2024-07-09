const GetGeneralInfoModel = require("../../Models/General Models/get_general_model");
exports.GetGeneralInfo = (req, res, next) => {
  GetGeneralInfoModel.GetGeneralInfos()
    .then((result) => {
      let data = {
        status: "Success",
        messege: "General infos given Below",
        generalInfos: result[0][0],
      };
      res.status(200).json(data);
    })
    .catch((error) => {
      console.log(error);
    });
};
