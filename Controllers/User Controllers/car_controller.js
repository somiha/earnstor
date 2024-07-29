const { log } = require("console");
const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");
require("dotenv").config();
const baseUrl = process.env.baseUrl;
const fs = require("fs");
const path = require("path");

exports.add_car_shop = async (req, res, next) => {
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
      "INSERT INTO car_shop (name, mobile_number, upazila_id, district_id, division_id, address, image, lang, lat, opening_time, closing_time, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
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
      msg: "car shop added successfully",
      car_shop: {
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

exports.get_car_shop = async (req, res, next) => {
  try {
    const getcar_shopQuery = `
      SELECT d.*, 
             u.id AS upazila_id, u.name AS upazila_name,
             di.id AS district_id, di.name AS district_name,
             dv.id AS division_id, dv.name AS division_name
      FROM car_shop d
      INNER JOIN upazila u ON d.upazila_id = u.id
      INNER JOIN district di ON d.district_id = di.id
      INNER JOIN division dv ON d.division_id = dv.id
    `;

    const car_shop = await queryAsyncWithoutValue(getcar_shopQuery);

    return res.status(200).json({ status: true, car_shop });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.add_car = async (req, res, next) => {
  try {
    const { name, seat, car_shop_id, description } = req.body;
    const image = req.files["image"];

    let imageUrl = null;

    if (image) {
      imageUrl = `${baseUrl}/uploads/${image[0].filename}`;
    }

    const addcarQuery =
      "INSERT INTO car (name, seat, car_shop_id, description, image) VALUES (?, ?, ?, ?, ?)";
    await queryAsync(addcarQuery, [
      name,
      seat,
      car_shop_id,
      description,
      imageUrl,
    ]);

    return res.status(200).json({
      status: true,
      msg: "car added successfully",
      data: {
        name,
        seat,
        car_shop_id,
        description,
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

exports.upload_car_images = async (req, res, next) => {
  try {
    const { car_id } = req.body;
    console.log(req.body);
    console.log(req.files);
    const carImages = req.files["car-images"];

    if (carImages && carImages.length > 0) {
      let carImageIds = [];

      for (let i = 0; i < carImages.length; i++) {
        const carImageUrl = `${baseUrl}/uploads/${carImages[i].filename}`;
        const insertcarImageQuery = "INSERT INTO images (url) VALUES (?)";
        const result = await queryAsync(insertcarImageQuery, [carImageUrl]);

        const insertedId = result.insertId;
        carImageIds.push(insertedId);
      }
      console.log(carImageIds);
      const stringifiedcarImageIds = JSON.stringify(carImageIds);
      const updatecarQuery = `UPDATE car SET images = ? WHERE id = ?`;
      await queryAsync(updatecarQuery, [stringifiedcarImageIds, car_id]);
      return res.status(200).json({ msg: "car images uploaded" });
    } else {
      return res.status(400).json({ msg: "No operator image uploaded" });
    }
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_car = async (req, res, next) => {
  try {
    const getQuery = `
      SELECT d.*, 
             u.id AS car_shop_id, u.name AS car_shop_name
      FROM car d
      INNER JOIN car_shop u ON d.car_shop_id = u.id
    `;

    const car = await queryAsyncWithoutValue(getQuery);

    const ImagesIds = car[0].images ? JSON.parse(car[0].images) : [];
    let promises = [];

    console.log("roomImagesIds", ImagesIds);

    promises = ImagesIds.map(async (imageId) => {
      const imageUrl = `SELECT url FROM images WHERE id = ?`;
      const result = await queryAsync(imageUrl, [imageId]);
      return result[0].url;
    });

    const images = await Promise.all(promises);
    const data = {
      ...car[0],
      images: images,
    };

    return res.status(200).json({ status: true, data });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_car_by_shop = async (req, res, next) => {
  try {
    const { shop_id } = req.query;
    const getQuery = `
      SELECT d.*, 
             u.id AS car_shop_id, u.name AS car_shop_name
      FROM car d
      INNER JOIN car_shop u ON d.car_shop_id = u.id WHERE car_shop_id = ?
    `;

    const car = await queryAsync(getQuery, [shop_id]);

    const ImagesIds = car[0].images ? JSON.parse(car[0].images) : [];
    let promises = [];

    console.log("roomImagesIds", ImagesIds);

    promises = ImagesIds.map(async (imageId) => {
      const imageUrl = `SELECT url FROM images WHERE id = ?`;
      const result = await queryAsync(imageUrl, [imageId]);
      return result[0].url;
    });

    const images = await Promise.all(promises);
    const data = {
      ...car[0],
      images: images,
    };

    return res.status(200).json({ status: true, data });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_car_by_car = async (req, res, next) => {
  try {
    const { car_id } = req.query;
    const getQuery = `
      SELECT d.*, 
             u.id AS car_shop_id, u.name AS car_shop_name
      FROM car d
      INNER JOIN car_shop u ON d.car_shop_id = u.id WHERE d.id = ?
    `;

    const car = await queryAsync(getQuery, [car_id]);

    const ImagesIds = car[0].images ? JSON.parse(car[0].images) : [];
    let promises = [];

    console.log("roomImagesIds", ImagesIds);

    promises = ImagesIds.map(async (imageId) => {
      const imageUrl = `SELECT url FROM images WHERE id = ?`;
      const result = await queryAsync(imageUrl, [imageId]);
      return result[0].url;
    });

    const images = await Promise.all(promises);
    const data = {
      ...car[0],
      images: images,
    };

    return res.status(200).json({ status: true, data });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.delete_car = async (req, res, next) => {
  try {
    const { id } = req.query;

    const deleteQuery = "DELETE FROM car WHERE id = ?";
    const result = await queryAsync(deleteQuery, [id]);

    if (result.affectedRows > 0) {
      return res.status(200).json({
        status: true,
        msg: "car deleted successfully",
      });
    } else {
      return res.status(404).json({
        status: false,
        msg: "car not found",
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

exports.add_rent = async (req, res, next) => {
  try {
    const { shop_id, car_id, user_id } = req.body;

    const addQuery =
      "INSERT INTO rent (shop_id, car_id, user_id, status) VALUES (?, ?, ?, ?)";
    await queryAsync(addQuery, [shop_id, car_id, user_id, "Pending"]);

    return res.status(200).json({
      status: true,
      msg: "rent added successfully",
      rent: {
        shop_id,
        car_id,
        user_id,
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

exports.get_rent_by_user = async (req, res, next) => {
  try {
    const { user_id } = req.query;
    const getQuery = `
      SELECT d.*, 
             u.userid AS user_id, u.name AS user_name,
             di.id AS shop_id, di.name AS car_shop_name,
             dv.*
      FROM rent d
      INNER JOIN users u ON d.user_id = u.userid
      INNER JOIN car_shop di ON d.shop_id = di.id
      INNER JOIN car dv ON d.car_id = dv.id WHERE user_id = ?
    `;

    const rents = await queryAsync(getQuery, [user_id]);

    return res.status(200).json({ status: true, rents });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};
