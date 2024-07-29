const { log } = require("console");
const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");
require("dotenv").config();
const baseUrl = process.env.baseUrl;
const fs = require("fs");
const path = require("path");

exports.add_all_category = async (req, res, next) => {
  try {
    const { name } = req.body;
    const image = req.files["image"];

    let imageUrl = null;

    if (image) {
      imageUrl = `${baseUrl}/uploads/${image[0].filename}`;
    }

    const addQuery = "INSERT INTO all_category (name, image) VALUES (?, ?)";
    await queryAsync(addQuery, [name, imageUrl]);

    return res.status(200).json({
      status: true,
      msg: "All category added successfully",
      allCategory: {
        name,
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

exports.get_all_category = async (req, res, next) => {
  try {
    const getQuery = `
      SELECT * FROM all_category
    `;

    const allCategory = await queryAsyncWithoutValue(getQuery);

    return res.status(200).json({ status: true, allCategory });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.delete_all_category = async (req, res, next) => {
  try {
    const { id } = req.query;

    const deleteQuery = "DELETE FROM all_category WHERE id = ?";
    const result = await queryAsync(deleteQuery, [id]);

    if (result.affectedRows > 0) {
      return res.status(200).json({
        status: true,
        msg: "All category deleted successfully",
      });
    } else {
      return res.status(404).json({
        status: false,
        msg: "All category not found",
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

exports.add_sub_category = async (req, res, next) => {
  try {
    const { name, ref_id } = req.body;
    const image = req.files["image"];

    let imageUrl = null;

    if (image) {
      imageUrl = `${baseUrl}/uploads/${image[0].filename}`;
    }

    const addQuery =
      "INSERT INTO sub_category (name, ref_id, image) VALUES (?, ?, ?)";
    await queryAsync(addQuery, [name, ref_id, imageUrl]);

    return res.status(200).json({
      status: true,
      msg: "Sub category added successfully",
      allCategory: {
        name,
        ref_id,
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

exports.get_sub_category = async (req, res, next) => {
  try {
    const getQuery = `
      SELECT s.*, r.name AS ref_name FROM sub_category s INNER JOIN all_category r ON s.ref_id = r.id
    `;

    const subCategory = await queryAsyncWithoutValue(getQuery);

    return res.status(200).json({ status: true, subCategory });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.delete_sub_category = async (req, res, next) => {
  try {
    const { id } = req.query;

    const deleteQuery = "DELETE FROM sub_category WHERE id = ?";
    const result = await queryAsync(deleteQuery, [id]);

    if (result.affectedRows > 0) {
      return res.status(200).json({
        status: true,
        msg: "Sub category deleted successfully",
      });
    } else {
      return res.status(404).json({
        status: false,
        msg: "Sub category not found",
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

exports.add_extra_category = async (req, res, next) => {
  try {
    const { name, ref_id } = req.body;
    const image = req.files["image"];

    let imageUrl = null;

    if (image) {
      imageUrl = `${baseUrl}/uploads/${image[0].filename}`;
    }

    const addQuery =
      "INSERT INTO extra_category (name, ref_id, image) VALUES (?, ?, ?)";
    await queryAsync(addQuery, [name, ref_id, imageUrl]);

    return res.status(200).json({
      status: true,
      msg: "Extra category added successfully",
      extraCategory: {
        name,
        ref_id,
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

exports.get_extra_category = async (req, res, next) => {
  try {
    const getQuery = `
      SELECT s.*, r.name AS ref_name FROM extra_category s INNER JOIN sub_category r ON s.ref_id = r.id
    `;

    const extraCategory = await queryAsyncWithoutValue(getQuery);

    return res.status(200).json({ status: true, extraCategory });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.delete_extra_category = async (req, res, next) => {
  try {
    const { id } = req.query;

    const deleteQuery = "DELETE FROM extra_category WHERE id = ?";
    const result = await queryAsync(deleteQuery, [id]);

    if (result.affectedRows > 0) {
      return res.status(200).json({
        status: true,
        msg: "Extra category deleted successfully",
      });
    } else {
      return res.status(404).json({
        status: false,
        msg: "Extra category not found",
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
