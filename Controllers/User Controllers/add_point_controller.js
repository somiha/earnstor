const AddPointModel = require("../../Models/User Models/add_point_model");
// exports.AddPoint = (req, res, next) => {
//   let userID = req.query.userid;
//   let point = req.body.point;

//   AddPointModel.SelectPoint(userID)
//     .then((result) => {
//       AddPointModel.AddPoint(result, userID, parseFloat(point))
//         .then((result2) => {
//           let data = {
//             status: "Success",
//             messege: "Point Added",
//             userID: userID,
//           };
//           res.status(200).json(data);
//         })
//         .catch((error) => console.log(error));
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };

exports.AddPoint = async (req, res, next) => {
  let userID = req.query.userid;
  let point = parseFloat(req.body.point);
  let typeID = req.body.type_id;

  try {
    let result = await AddPointModel.SelectPoint(userID);
    await AddPointModel.AddPoint(result, userID, point);
    await AddPointModel.AddEarnHistory(userID, point, typeID);

    let data = {
      status: "Success",
      message: "Point Added",
      userID: userID,
    };
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", message: "Internal server error" });
  }
};
