const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");

exports.getLogin = async (req, res, next) => {
  try {
    return res.status(200).render("pages/login");
  } catch (e) {
    return res.status(500).json({ msg: "Error" });
  }
};

exports.postLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const getUserQuery = "SELECT * FROM admin_info WHERE username = ?";

    const user = await queryAsync(getUserQuery, [username]);
    const result = user[0];
    const isMatch = password == result.password;
    console.log("user", user, password, isMatch);

    if (!isMatch) {
      return res.status(401).redirect(`/admin/login`);
    }
    res.cookie("is_logged_in", true, { httpOnly: true });
    console.log("here");
    return res.redirect("/");
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Error" });
  }
};

exports.logOut = async (req, res, next) => {
  try {
    console.log("123");
    // Clear the 'token' cookie
    res.clearCookie("is_logged_in");

    return res.redirect(`/admin/login`);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};
