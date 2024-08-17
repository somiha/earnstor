const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");
require("dotenv").config();
const baseUrl = process.env.baseUrl;

exports.ad_package = async (req, res, next) => {
  try {
    const { name, duration, description, cost } = req.body;

    const addQuery =
      "INSERT INTO ad_package (name, duration, description, cost) VALUES (?, ?, ?, ?)";
    await queryAsync(addQuery, [name, duration, description, cost]);

    return res.status(200).json({
      status: true,
      msg: "ad package added successfully",
      ad_package: { name, duration, description, cost },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_ad_package = async (req, res, next) => {
  try {
    const { ad_cat_id } = req.query;
    const getQuery = `SELECT * FROM ad_package WHERE ad_cat_id = ?`;
    const ad_packages = await queryAsync(getQuery, [ad_cat_id]);

    return res.status(200).json({ status: true, ad_packages });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.add_ad_category = async (req, res, next) => {
  try {
    const { name } = req.body;
    const image = req.files["image"];

    let imageUrl = null;

    if (image) {
      imageUrl = `${baseUrl}/uploads/${image[0].filename}`;
    }

    const addQuery = "INSERT INTO ad_category (name, image) VALUES (?, ?)";
    await queryAsync(addQuery, [name, imageUrl]);

    return res.status(200).json({
      status: true,
      msg: "Ad category added successfully",
      adCategory: {
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

exports.get_ad_category = async (req, res, next) => {
  try {
    const getQuery = `
      SELECT * FROM ad_category
    `;

    const adCategory = await queryAsyncWithoutValue(getQuery);

    return res.status(200).json({ status: true, adCategory });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.run_ad = async (req, res, next) => {
  try {
    const { user_id, ad_cat_id, ad_package_id, transaction_id, url } = req.body;

    const addQuery =
      "INSERT INTO run_ad (user_id, ad_cat_id, ad_package_id, transaction_id, url) VALUES (?, ?, ?, ?, ?)";
    await queryAsync(addQuery, [
      user_id,
      ad_cat_id,
      ad_package_id,
      transaction_id,
      url,
    ]);

    return res.status(200).json({
      status: true,
      msg: "ad added successfully",
      ad_package: { user_id, ad_cat_id, ad_package_id, transaction_id, url },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_ad = async (req, res, next) => {
  try {
    const { package_id } = req.query;
    const getQuery = `SELECT * FROM run_ad WHERE ad_package_id = ?`;
    const ad_packages = await queryAsync(getQuery, [package_id]);

    return res.status(200).json({ status: true, ad_packages });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.add_package = async (req, res, next) => {
  try {
    let package_name = req.body.package_name;
    let price = req.body.price;
    let description = req.body.description;

    const addPackageTypeQuery = `INSERT INTO buy_package (package_name, description, price) VALUES (?, ?, ?)`;
    await queryAsync(addPackageTypeQuery, [package_name, description, price]);
    return res.status(200).json({
      msg: "Package added successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.select_package = async (req, res, next) => {
  try {
    let user_id = req.body.user_id;
    let package_id = req.body.package_id;

    const selectPackageQuery = `INSERT INTO select_package (user_id, package_id) VALUES (?, ?)`;
    await queryAsync(selectPackageQuery, [user_id, package_id]);
    return res.status(200).json({
      msg: "Package added successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.getSelectedPackageByUserId = async (req, res, next) => {
  try {
    const { user_id } = req.query;

    const getPackageQuery = `
      SELECT sp.*, bp.package_name AS package_name
      FROM select_package sp
      JOIN buy_package bp ON sp.package_id = bp.id
      WHERE sp.user_id = ?
    `;

    const selectedPackage = await queryAsync(getPackageQuery, [user_id]);

    if (selectedPackage.length === 0) {
      return res.status(404).json({
        msg: "No package found for this user",
      });
    }

    return res.status(200).json({
      msg: "Package retrieved successfully",
      package: selectedPackage[0],
    });
  } catch (err) {
    console.log(err);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.get_package = async (req, res, next) => {
  try {
    const getQuery = `SELECT * FROM buy_package`;
    const packages = await queryAsyncWithoutValue(getQuery);

    return res.status(200).json({ status: true, packages });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};
