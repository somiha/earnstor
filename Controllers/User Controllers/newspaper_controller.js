const { log } = require("console");
const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");
require("dotenv").config();
const baseUrl = process.env.baseUrl;
const fs = require("fs");
const path = require("path");

exports.add_newspaper = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const image = req.files["image"];

    let imageUrl = null;

    if (image) {
      imageUrl = `${baseUrl}/uploads/${image[0].filename}`;
    }

    const addQuery =
      "INSERT INTO newspaper (name, link, image) VALUES (?, ?, ?)";
    await queryAsync(addQuery, [name, link, imageUrl]);

    return res.status(200).json({
      status: true,
      msg: "Newspaper added successfully",
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

exports.get_newspaper = async (req, res, next) => {
  try {
    const getQuery = `
      SELECT * FROM newspaper
    `;

    const newspaper = await queryAsyncWithoutValue(getQuery);

    return res.status(200).json({ status: true, newspaper });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.delete_newspaper = async (req, res, next) => {
  try {
    const { id } = req.query;

    const deleteQuery = "DELETE FROM newspaper WHERE id = ?";
    const result = await queryAsync(deleteQuery, [id]);

    if (result.affectedRows > 0) {
      return res.status(200).json({
        status: true,
        msg: "Newspaper deleted successfully",
      });
    } else {
      return res.status(404).json({
        status: false,
        msg: "Newspaper not found",
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
