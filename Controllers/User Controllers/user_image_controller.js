const fs = require("fs");
const path = require("path");
require("dotenv").config();
const baseUrl = process.env.baseUrl;
const UserImageModel = require("../../Models/User Models/user_image_model");
function getAppRootDir() {
  let currentDir = __dirname;
  while (!fs.existsSync(path.join(currentDir, "package.json"))) {
    currentDir = path.join(currentDir, "..");
  }
  return currentDir;
}
function cutString(url) {
  // Find the index of the "/uploads" substring
  const index = url.indexOf("/uploads");

  // Check if the substring is found
  if (index !== -1) {
    // Cut the string starting from the index and store it in the variable
    const cutString = url.slice(index);
    return cutString;
  } else {
    // If the substring is not found, return the original URL
    return url;
  }
}
exports.SetUserImage = (req, res, next) => {
  let userId = req.query.userId;
  console.log(req.file);
  let imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
  UserImageModel.checkUser(userId)
    .then((result) => {
      if (result[0].length < 1) {
        let data = {
          status: "Failed",
          messege: "No user found",
        };
        res.status(400).json(data);
      } else {
        UserImageModel.setImage(userId, imageUrl)
          .then((result2) => {
            let data = {
              status: "Success",
              messege: "User Info Changed",
            };
            if (result[0][0].imageUrl != null) {
              let splittedPath = cutString(result[0][0].imageUrl);
              let rootDir = getAppRootDir();
              fs.unlink(rootDir + splittedPath, (error) => {
                res.status(200).json(data);
              });
            } else {
              res.status(200).json(data);
            }
          })
          .catch((error) => {
            res.status(400).json("Something is wrong");
          });
      }
    })
    .catch((error) => {
      res.status(400).json("Something is wrong");
    });
};
