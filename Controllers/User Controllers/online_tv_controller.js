const { log } = require("console");
const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");
require("dotenv").config();
const baseUrl = process.env.baseUrl;
const fs = require("fs");
const path = require("path");

exports.add_online_tv = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const image = req.files["image"];

    let imageUrl = null;

    if (image) {
      imageUrl = `${baseUrl}/uploads/${image[0].filename}`;
    }

    const addQuery = "INSERT INTO live_tv (name, link, image) VALUES (?, ?, ?)";
    await queryAsync(addQuery, [name, link, imageUrl]);

    return res.status(200).json({
      status: true,
      msg: "Online TV added successfully",
      OnlineTV: {
        name,
        link,
        image: imageUrl,
      },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_online_tv = async (req, res, next) => {
  try {
    const getQuery = `
      SELECT * FROM live_tv
    `;

    const onlineTV = await queryAsyncWithoutValue(getQuery);

    return res.status(200).json({ status: true, onlineTV });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.delete_online_tv = async (req, res, next) => {
  try {
    const { id } = req.query;

    const deleteQuery = "DELETE FROM live_tv WHERE id = ?";
    const result = await queryAsync(deleteQuery, [id]);

    if (result.affectedRows > 0) {
      return res.status(200).json({
        status: true,
        msg: "Online TV deleted successfully",
      });
    } else {
      return res.status(404).json({
        status: false,
        msg: "Online TV not found",
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
