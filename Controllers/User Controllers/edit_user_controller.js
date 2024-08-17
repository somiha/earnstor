// const editModel = require("../../Models/User Models/edit_user_model");
// exports.EditUser = (req, res, next) => {
//   let userId = req.query.userId;
//   let name = req.body.name;
//   let email = req.body.email;
//   let mobile = req.body.mobile;
//   editModel.checkUser(userId).then((result) => {
//     if (result[0].length < 1) {
//       let data = {
//         status: "Failed",
//         messege: "No user found",
//       };
//       res.status(400).json(data);
//     } else {
//       editModel
//         .changeInfo(userId, name, email, mobile)
//         .then((result2) => {
//           let data = {
//             status: "Success",
//             messege: "User Info Changed",
//           };
//           res.status(200).json(data);
//         })
//         .catch((error) => {
//           res.status(400).json("Something is wrong");
//         });
//     }
//   });
// };

const editModel = require("../../Models/User Models/edit_user_model");

exports.EditUser = async (req, res, next) => {
  try {
    let userId = req.query.userId;
    let name = req.body.name;
    let email = req.body.email;
    let mobile = req.body.mobile;
    let file = req.file; // This will hold the uploaded image file if provided

    const result = await editModel.checkUser(userId);

    if (result[0].length < 1) {
      return res.status(400).json({
        status: "Failed",
        message: "No user found",
      });
    }

    // Update user information if name, email, or mobile is provided
    if (name || email || mobile) {
      await editModel.changeInfo(userId, name, email, mobile);
    }

    // Update user image if a file is uploaded
    if (file) {
      const imageResult = await editModel.updateUserImage(userId, file);

      if (imageResult.status !== "Success") {
        return res.status(400).json(imageResult);
      }
    }

    res.status(200).json({
      status: "Success",
      message: "User Info and/or Image Updated",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(400).json({
      status: "Error",
      message: "Something went wrong",
    });
  }
};
