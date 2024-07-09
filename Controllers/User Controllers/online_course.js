const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");
require("dotenv").config();
const baseUrl = process.env.baseUrl;

exports.online_course = async (req, res, next) => {
  try {
    const { app_name, link } = req.body;
    const icon = req.files["icon"];

    let iconUrl = null;

    if (icon && icon.length > 0) {
      iconUrl = `${baseUrl}/uploads/${icon[0].filename}`;
    }

    const addonlineCourseQuery =
      "INSERT INTO online_course (app_name, icon, link) VALUES (?, ?, ?)";
    await queryAsync(addonlineCourseQuery, [app_name, iconUrl, link]);

    return res.status(200).json({
      status: true,
      msg: "Online course added successfully",
      onlineCourse: { app_name, icon: iconUrl, link },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_online_course = async (req, res, next) => {
  try {
    const getonlineCoursesQuery = `SELECT * FROM online_course`;
    const onlineCourses = await queryAsyncWithoutValue(getonlineCoursesQuery);

    return res.status(200).json({ status: true, onlineCourses });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};
