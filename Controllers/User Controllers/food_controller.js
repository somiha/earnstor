const { log } = require("console");
const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");
require("dotenv").config();
const baseUrl = process.env.baseUrl;
const fs = require("fs");
const path = require("path");

exports.add_restautants = async (req, res, next) => {
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
      "INSERT INTO restaurants (name, mobile_number, upazila_id, district_id, division_id, address, image, lang, lat, opening_time, closing_time, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
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
      msg: "Restaurant added successfully",
      Restaurant: {
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

exports.get_restautants = async (req, res, next) => {
  try {
    const getrestautantsQuery = `
      SELECT d.*, 
             u.id AS upazila_id, u.name AS upazila_name,
             di.id AS district_id, di.name AS district_name,
             dv.id AS division_id, dv.name AS division_name
      FROM restaurants d
      INNER JOIN upazila u ON d.upazila_id = u.id
      INNER JOIN district di ON d.district_id = di.id
      INNER JOIN division dv ON d.division_id = dv.id
    `;

    const restautants = await queryAsyncWithoutValue(getrestautantsQuery);

    return res.status(200).json({ status: true, restautants });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.add_food = async (req, res, next) => {
  try {
    const { name, price, res_id, description } = req.body;
    const image = req.files["image"];

    let imageUrl = null;

    if (image) {
      imageUrl = `${baseUrl}/uploads/${image[0].filename}`;
    }

    const addFoodQuery =
      "INSERT INTO food (name, price, res_id, description, image) VALUES (?, ?, ?, ?, ?)";
    await queryAsync(addFoodQuery, [
      name,
      price,
      res_id,
      description,
      imageUrl,
    ]);

    return res.status(200).json({
      status: true,
      msg: "Food added successfully",
      data: {
        name,
        price,
        res_id,
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

exports.upload_food_images = async (req, res, next) => {
  try {
    const { food_id } = req.body;
    console.log(req.body);
    console.log(req.files);
    const foodImages = req.files["food-images"];

    if (foodImages && foodImages.length > 0) {
      let foodImageIds = [];

      for (let i = 0; i < foodImages.length; i++) {
        const foodImageUrl = `${baseUrl}/uploads/${foodImages[i].filename}`;
        const insertFoodImageQuery = "INSERT INTO images (url) VALUES (?)";
        const result = await queryAsync(insertFoodImageQuery, [foodImageUrl]);

        const insertedId = result.insertId;
        foodImageIds.push(insertedId);
      }
      console.log(foodImageIds);
      const stringifiedFoodImageIds = JSON.stringify(foodImageIds);
      const updateFoodQuery = `UPDATE food SET images = ? WHERE id = ?`;
      await queryAsync(updateFoodQuery, [stringifiedFoodImageIds, food_id]);
      return res.status(200).json({ msg: "Food images uploaded" });
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

// exports.get_food = async (req, res, next) => {
//   try {
//     const getQuery = `
//       SELECT d.*,
//              u.id AS restaurant_id, u.name AS restaurant_name
//       FROM food d
//       INNER JOIN restaurants u ON d.res_id = u.id
//     `;

//     const food = await queryAsyncWithoutValue(getQuery);

//     const ImagesIds = food[0].images ? JSON.parse(food[0].images) : [];
//     let promises = [];

//     console.log("roomImagesIds", ImagesIds);

//     promises = ImagesIds.map(async (imageId) => {
//       const imageUrl = `SELECT url FROM images WHERE id = ?`;
//       const result = await queryAsync(imageUrl, [imageId]);
//       return result[0].url;
//     });

//     const images = await Promise.all(promises);
//     const data = {
//       ...food,
//       images: images,
//     };

//     return res.status(200).json({ status: true, data });
//   } catch (e) {
//     console.error(e);
//     return res
//       .status(500)
//       .json({ status: false, msg: "Internal Server Error" });
//   }
// };

exports.get_food = async (req, res, next) => {
  try {
    const getQuery = `
      SELECT d.*, 
             u.id AS restaurant_id, 
             u.name AS restaurant_name,
             fc.name AS cat_name
      FROM food d
      INNER JOIN restaurants u ON d.res_id = u.id
      LEFT JOIN food_cat fc ON d.cat_id = fc.id
    `;

    const food = await queryAsyncWithoutValue(getQuery);

    let data = await Promise.all(
      food.map(async (item) => {
        const ImagesIds = item.images ? JSON.parse(item.images) : [];
        let promises = ImagesIds.map(async (imageId) => {
          const imageUrlQuery = `SELECT url FROM images WHERE id = ?`;
          const result = await queryAsync(imageUrlQuery, [imageId]);
          return result[0].url;
        });

        const images = await Promise.all(promises);

        return {
          ...item,
          images: images,
        };
      })
    );

    return res.status(200).json({ status: true, data });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

// exports.get_food_by_res = async (req, res, next) => {
//   try {
//     const { res_id } = req.query;
//     const getQuery = `
//       SELECT d.*,
//              u.id AS restaurant_id, u.name AS restaurant_name
//       FROM food d
//       INNER JOIN restaurants u ON d.res_id = u.id WHERE res_id = ?
//     `;

//     const food = await queryAsync(getQuery, [res_id]);

//     const ImagesIds = food[0].images ? JSON.parse(food[0].images) : [];
//     let promises = [];

//     console.log("roomImagesIds", ImagesIds);

//     promises = ImagesIds.map(async (imageId) => {
//       const imageUrl = `SELECT url FROM images WHERE id = ?`;
//       const result = await queryAsync(imageUrl, [imageId]);
//       return result[0].url;
//     });

//     const images = await Promise.all(promises);
//     const data = {
//       ...food,
//       images: images,
//     };

//     return res.status(200).json({ status: true, data });
//   } catch (e) {
//     console.error(e);
//     return res
//       .status(500)
//       .json({ status: false, msg: "Internal Server Error" });
//   }
// };

exports.get_food_by_res = async (req, res, next) => {
  try {
    const { res_id } = req.query;
    const getQuery = `
      SELECT d.*, 
             u.id AS restaurant_id, u.name AS restaurant_name,
             fc.name AS cat_name
      FROM food d
      INNER JOIN restaurants u ON d.res_id = u.id
      LEFT JOIN food_cat fc ON d.cat_id = fc.id WHERE d.res_id = ?
    `;

    const food = await queryAsync(getQuery, [res_id]);

    const data = await Promise.all(
      food.map(async (item) => {
        const ImagesIds = item.images ? JSON.parse(item.images) : [];
        const promises = ImagesIds.map(async (imageId) => {
          const imageUrlQuery = `SELECT url FROM images WHERE id = ?`;
          const result = await queryAsync(imageUrlQuery, [imageId]);
          return result[0].url;
        });

        const images = await Promise.all(promises);

        return {
          ...item,
          images: images,
        };
      })
    );

    return res.status(200).json({ status: true, data });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_food_by_food = async (req, res, next) => {
  try {
    const { food_id } = req.query;
    const getQuery = `
      SELECT d.*, 
             u.id AS restaurant_id, u.name AS restaurant_name,
             fc.name AS cat_name
      FROM food d
      INNER JOIN restaurants u ON d.res_id = u.id
      LEFT JOIN food_cat fc ON d.cat_id = fc.id WHERE d.id = ?
    `;

    const food = await queryAsync(getQuery, [food_id]);

    const ImagesIds = food[0].images ? JSON.parse(food[0].images) : [];
    let promises = [];

    console.log("roomImagesIds", ImagesIds);

    promises = ImagesIds.map(async (imageId) => {
      const imageUrl = `SELECT url FROM images WHERE id = ?`;
      const result = await queryAsync(imageUrl, [imageId]);
      return result[0].url;
    });

    const images = await Promise.all(promises);
    const data = {
      ...food[0],
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

exports.delete_food = async (req, res, next) => {
  try {
    const { id } = req.query;

    const deleteQuery = "DELETE FROM food WHERE id = ?";
    const result = await queryAsync(deleteQuery, [id]);

    if (result.affectedRows > 0) {
      return res.status(200).json({
        status: true,
        msg: "Food deleted successfully",
      });
    } else {
      return res.status(404).json({
        status: false,
        msg: "Food not found",
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

exports.add_order = async (req, res, next) => {
  try {
    const { res_id, food_id, user_id } = req.body;

    const addQuery =
      "INSERT INTO order_food (res_id, food_id, user_id, status) VALUES (?, ?, ?, ?)";
    await queryAsync(addQuery, [res_id, food_id, user_id, "Pending"]);

    return res.status(200).json({
      status: true,
      msg: "Order added successfully",
      Order: {
        res_id,
        food_id,
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

exports.get_order_by_user = async (req, res, next) => {
  try {
    const { user_id } = req.query;
    const getQuery = `
      SELECT d.*, 
             u.userid AS user_id, u.name AS user_name,
             di.id AS res_id, di.name AS restaurant_name,
             dv.*
      FROM order_food d
      INNER JOIN users u ON d.user_id = u.userid
      INNER JOIN restaurants di ON d.res_id = di.id
      INNER JOIN food dv ON d.food_id = dv.id WHERE user_id = ?
    `;

    const orders = await queryAsync(getQuery, [user_id]);

    return res.status(200).json({ status: true, orders });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};
