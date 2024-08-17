const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");
require("dotenv").config();
const baseUrl = process.env.baseUrl;

exports.blood_group = async (req, res, next) => {
  try {
    const { blood_group } = req.body;

    const addblood_groupQuery =
      "INSERT INTO blood_group (blood_group) VALUES (?)";
    await queryAsync(addblood_groupQuery, [blood_group]);

    return res.status(200).json({
      status: true,
      msg: "blood_group added successfully",
      blood_group: { blood_group },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_blood_group = async (req, res, next) => {
  try {
    const getblood_groupsQuery = `SELECT * FROM blood_group`;
    const blood_groups = await queryAsyncWithoutValue(getblood_groupsQuery);

    return res.status(200).json({ status: true, blood_groups });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.upazila = async (req, res, next) => {
  try {
    const { name } = req.body;

    const addupazilaQuery = "INSERT INTO upazila (name) VALUES (?)";
    await queryAsync(addupazilaQuery, [name]);

    return res.status(200).json({
      status: true,
      msg: "upazila added successfully",
      upazila: { name },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_upazila = async (req, res, next) => {
  try {
    const { district_id } = req.query;
    const getupazilasQuery = `SELECT * FROM upazila WHERE district_id = ?`;
    const upazilas = await queryAsync(getupazilasQuery, [district_id]);

    return res.status(200).json({ status: true, upazilas });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.district = async (req, res, next) => {
  try {
    const { name } = req.body;

    const adddistrictQuery = "INSERT INTO district (name) VALUES (?)";
    await queryAsync(adddistrictQuery, [name]);

    return res.status(200).json({
      status: true,
      msg: "district added successfully",
      district: { name },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_district = async (req, res, next) => {
  try {
    const { division_id } = req.query;
    const getdistrictsQuery = `SELECT * FROM district WHERE division_id = ?`;
    const districts = await queryAsync(getdistrictsQuery, [division_id]);

    return res.status(200).json({ status: true, districts });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.division = async (req, res, next) => {
  try {
    const { name } = req.body;

    const adddivisionQuery = "INSERT INTO division (name) VALUES (?)";
    await queryAsync(adddivisionQuery, [name]);

    return res.status(200).json({
      status: true,
      msg: "division added successfully",
      division: { name },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_division = async (req, res, next) => {
  try {
    const getdivisionsQuery = `SELECT * FROM division`;
    const divisions = await queryAsyncWithoutValue(getdivisionsQuery);

    return res.status(200).json({ status: true, divisions });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};
