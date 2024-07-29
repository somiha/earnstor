const { log } = require("console");
const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");
require("dotenv").config();
const baseUrl = process.env.baseUrl;
const fs = require("fs");
const path = require("path");

exports.add_delivery_company = async (req, res, next) => {
  try {
    const {
      name,
      mobile_number,
      upazila_id,
      district_id,
      division_id,
      address,
      lang,
      lat,
      opening_time,
      closing_time,
      email,
    } = req.body;
    const image = req.files["image"];

    let imageUrl = null;

    if (image) {
      imageUrl = `${baseUrl}/uploads/${image[0].filename}`;
    }

    const addQuery =
      "INSERT INTO delivery_company (name, mobile_number, upazila_id, district_id, division_id, address, image, lang, lat, opening_time, closing_time, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    await queryAsync(addQuery, [
      name,
      mobile_number,
      upazila_id,
      district_id,
      division_id,
      address,
      imageUrl,
      lang,
      lat,
      opening_time,
      closing_time,
      email,
    ]);

    return res.status(200).json({
      status: true,
      msg: "Delivery Company added successfully",
      delivery_company: {
        name,
        mobile_number,
        upazila_id,
        district_id,
        division_id,
        address,
        image: imageUrl,
        lang,
        lat,
        opening_time,
        closing_time,
        email,
      },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_delivery_company = async (req, res, next) => {
  try {
    const getdelivery_companyQuery = `
      SELECT d.*, 
             u.id AS upazila_id, u.name AS upazila_name,
             di.id AS district_id, di.name AS district_name,
             dv.id AS division_id, dv.name AS division_name
      FROM delivery_company d
      INNER JOIN upazila u ON d.upazila_id = u.id
      INNER JOIN district di ON d.district_id = di.id
      INNER JOIN division dv ON d.division_id = dv.id
    `;

    const delivery_company = await queryAsyncWithoutValue(
      getdelivery_companyQuery
    );

    return res.status(200).json({ status: true, delivery_company });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.add_order = async (req, res, next) => {
  try {
    const {
      deliver_id,
      user_id,
      from_name,
      to_name,
      percel_type,
      weight,
      from_mobile_number,
      to_mobile_number,
      from_address,
      to_address,
    } = req.body;

    const addcarQuery =
      "INSERT INTO percel_order (deliver_id, user_id, from_name, to_name, percel_type, weight, from_mobile_number, to_mobile_number, from_address, to_address, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    await queryAsync(addcarQuery, [
      deliver_id,
      user_id,
      from_name,
      to_name,
      percel_type,
      weight,
      from_mobile_number,
      to_mobile_number,
      from_address,
      to_address,
      "Pending",
    ]);

    return res.status(200).json({
      status: true,
      msg: "Order added successfully",
      data: {
        deliver_id,
        user_id,
        from_name,
        to_name,
        percel_type,
        weight,
        from_mobile_number,
        to_mobile_number,
        from_address,
        to_address,
        status: "Pending",
      },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_order = async (req, res, next) => {
  try {
    const getQuery = `
      SELECT d.*, 
             u.id AS deliver_id, u.name AS name
      FROM percel_order d
      INNER JOIN delivery_company u ON d.deliver_id = u.id
    `;

    const order = await queryAsyncWithoutValue(getQuery);

    return res.status(200).json({ status: true, order });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_order_by_user = async (req, res, next) => {
  try {
    const { user_id } = req.query;
    const getQuery = `
      SELECT d.*, 
             u.id AS deliver_id, u.name AS name
      FROM percel_order d
      INNER JOIN delivery_company u ON d.deliver_id = u.id WHERE user_id = ?
    `;

    const order = await queryAsync(getQuery, [user_id]);

    return res.status(200).json({ status: true, order });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.delete_order = async (req, res, next) => {
  try {
    const { id } = req.query;

    const deleteQuery = "DELETE FROM percel_order WHERE id = ?";
    const result = await queryAsync(deleteQuery, [id]);

    if (result.affectedRows > 0) {
      return res.status(200).json({
        status: true,
        msg: "Order deleted successfully",
      });
    } else {
      return res.status(404).json({
        status: false,
        msg: "order not found",
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
