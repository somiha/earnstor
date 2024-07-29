const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");
require("dotenv").config();
const baseUrl = process.env.baseUrl;

exports.online_course = async (req, res, next) => {
  try {
    const { app_name, price, link } = req.body;
    const icon = req.files["icon"];

    let iconUrl = null;

    if (icon && icon.length > 0) {
      iconUrl = `${baseUrl}/uploads/${icon[0].filename}`;
    }

    const addonlineCourseQuery =
      "INSERT INTO online_course (app_name, icon, link, price, is_popular) VALUES (?, ?, ?, ?, ?)";
    await queryAsync(addonlineCourseQuery, [app_name, iconUrl, price, link, 0]);

    return res.status(200).json({
      status: true,
      msg: "Online course added successfully",
      onlineCourse: { app_name, icon: iconUrl, price, link },
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
    const getonlineCoursesQuery = `SELECT * FROM online_course WHERE is_popular = 0`;
    const onlineCourses = await queryAsyncWithoutValue(getonlineCoursesQuery);

    return res.status(200).json({ status: true, onlineCourses });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.popular_course = async (req, res, next) => {
  try {
    const { app_name, price, link } = req.body;
    const icon = req.files["icon"];

    let iconUrl = null;

    if (icon && icon.length > 0) {
      iconUrl = `${baseUrl}/uploads/${icon[0].filename}`;
    }

    const addonlineCourseQuery =
      "INSERT INTO online_course (app_name, icon, link, price, is_popular) VALUES (?, ?, ?, ?, ?)";
    await queryAsync(addonlineCourseQuery, [app_name, iconUrl, link, price, 1]);

    return res.status(200).json({
      status: true,
      msg: "Online course added successfully",
      onlineCourse: { app_name, icon: iconUrl, price, link },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_popular_course = async (req, res, next) => {
  try {
    const getonlineCoursesQuery = `SELECT * FROM online_course WHERE is_popular = 1`;
    const onlineCourses = await queryAsyncWithoutValue(getonlineCoursesQuery);

    return res.status(200).json({ status: true, onlineCourses });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.buy_online_course = async (req, res, next) => {
  try {
    const { user_id, course_id, payment_id, status } = req.body;

    const addonlineCourseQuery =
      "INSERT INTO buy_option (user_id, course_id, payment_id, status) VALUES (?, ?, ?, ?)";
    await queryAsync(addonlineCourseQuery, [
      user_id,
      course_id,
      payment_id,
      "Pending",
    ]);

    return res.status(200).json({
      status: true,
      msg: "Online course Bought successfully",
      onlineCourse: { user_id, course_id, payment_id, status: "Pending" },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_buy_online_course = async (req, res, next) => {
  try {
    const { user_id, course_id } = req.query;
    const getonlineCoursesQuery = `SELECT * FROM buy_option WHERE user_id = ? AND course_id = ?`;
    const onlineCourses = await queryAsync(getonlineCoursesQuery, [
      user_id,
      course_id,
    ]);

    return res.status(200).json({ status: true, onlineCourses });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

// exports.get_buy_popular_course = async (req, res, next) => {
//   try {
//     const { user_id, course_id } = req.query;
//     const getonlineCoursesQuery = `SELECT * FROM buy_option WHERE is_popular = 1 AND user_id = ? AND course_id = ?`;
//     const onlineCourses = await queryAsynce(getonlineCoursesQuery, [
//       user_id,
//       course_id,
//     ]);

//     return res.status(200).json({ status: true, onlineCourses });
//   } catch (e) {
//     console.error(e);
//     return res
//       .status(500)
//       .json({ status: false, msg: "Internal Server Error" });
//   }
// };
