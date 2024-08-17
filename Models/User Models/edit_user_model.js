// const DB = require("../../Utils/db_connection");

// module.exports = class EditUser {
//   static checkUser(userId) {
//     return DB.execute("SELECT * FROM users WHERE userid = '" + userId + "'");
//   }

//   static changeInfo(userId, name, email, mobile) {
//     return DB.execute(
//       "UPDATE users SET name = '" +
//         name +
//         "', email = '" +
//         email +
//         "',  mobile = '" +
//         mobile +
//         "' WHERE userid = '" +
//         userId +
//         "'"
//     );
//   }
// };

const DB = require("../../Utils/db_connection");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const baseUrl = process.env.baseUrl;

function getAppRootDir() {
  let currentDir = __dirname;
  while (!fs.existsSync(path.join(currentDir, "package.json"))) {
    currentDir = path.join(currentDir, "..");
  }
  return currentDir;
}

function cutString(url) {
  const index = url.indexOf("/uploads");
  return index !== -1 ? url.slice(index) : url;
}

module.exports = class EditUser {
  static checkUser(userId) {
    return DB.execute("SELECT * FROM users WHERE userid = ?", [userId]);
  }

  static changeInfo(userId, name, email, mobile) {
    return DB.execute(
      "UPDATE users SET name = ?, email = ?, mobile = ? WHERE userid = ?",
      [name, email, mobile, userId]
    );
  }

  static setImage(userId, imageUrl) {
    return DB.execute("UPDATE users SET imageUrl = ? WHERE userid = ?", [
      imageUrl,
      userId,
    ]);
  }

  static async updateUserImage(userId, file) {
    try {
      const [result] = await this.checkUser(userId);
      if (result.length < 1) {
        return { status: "Failed", message: "No user found" };
      } else {
        const imageUrl = `${baseUrl}/uploads/${file.filename}`;
        await this.setImage(userId, imageUrl);

        if (result[0].imageUrl) {
          const splittedPath = cutString(result[0].imageUrl);
          const rootDir = getAppRootDir();
          fs.unlink(rootDir + splittedPath, (error) => {
            if (error) {
              console.error("Error deleting old image:", error);
            }
          });
        }

        return { status: "Success", message: "User Info Changed" };
      }
    } catch (error) {
      console.error("Error updating user image:", error);
      return { status: "Error", message: "Something is wrong" };
    }
  }
};
