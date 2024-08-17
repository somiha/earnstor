const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");
require("dotenv").config();
const baseUrl = process.env.baseUrl;

exports.level = async (req, res, next) => {
  try {
    const { name, refer } = req.body;

    const addQuery = "INSERT INTO level (name, refer) VALUES (?, ?)";
    await queryAsync(addQuery, [name, refer]);

    return res.status(200).json({
      status: true,
      msg: "level added successfully",
      ad_package: { name, refer },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_level = async (req, res, next) => {
  try {
    const getQuery = `SELECT * FROM level`;
    const level = await queryAsyncWithoutValue(getQuery);

    return res.status(200).json({ status: true, level });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.query;

    const deleteQuery = "DELETE FROM level WHERE id = ?";
    const result = await queryAsync(deleteQuery, [id]);

    if (result.affectedRows > 0) {
      return res.status(200).json({
        status: true,
        msg: "Level deleted successfully",
      });
    } else {
      return res.status(404).json({
        status: false,
        msg: "Post not found",
      });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};
