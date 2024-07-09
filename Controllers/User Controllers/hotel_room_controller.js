const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");
require("dotenv").config();
const baseUrl = process.env.baseUrl;

exports.add_hotel_room = async (req, res, next) => {
  try {
    const { hotel_id, room_name, total_num_room, price_per_night, facilities } =
      req.body;
    const image = req.files["image"];

    let imageUrl = null;

    if (image) {
      imageUrl = `${baseUrl}/uploads/${image[0].filename}`;
    }

    const addRoomQuery =
      "INSERT INTO hotel_room (hotel_id, room_name, total_num_room, price_per_night, facilities, image) VALUES (?, ?, ?, ?, ?, ?)";
    await queryAsync(addRoomQuery, [
      hotel_id,
      room_name,
      total_num_room,
      price_per_night,
      facilities,
      imageUrl,
    ]);

    return res.status(200).json({
      status: true,
      msg: "Hotel room added successfully",
      HotelRoom: {
        hotel_id,
        room_name,
        total_num_room,
        price_per_night,
        facilities,
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

exports.upload_hotel_room_images = async (req, res, next) => {
  try {
    const { room_id } = req.body;
    const hotelRoomImages = req.files["hotel-room-images"];
    console.log("hotelRoomImages", req.files);

    if (hotelRoomImages && hotelRoomImages.length > 0) {
      let roomImageIds = [];

      for (let i = 0; i < hotelRoomImages.length; i++) {
        const roomImageUrl = `${baseUrl}/uploads/${hotelRoomImages[i].filename}`;
        const insertRoomImageQuery = "INSERT INTO images (url) VALUES (?)";
        const result = await queryAsync(insertRoomImageQuery, [roomImageUrl]);

        const insertedId = result.insertId;
        roomImageIds.push(insertedId);
      }
      const stringifiedRoomImageIds = JSON.stringify(roomImageIds);
      const updateRoomQuery = `UPDATE hotel_room SET images = ? WHERE id = ?`;
      await queryAsync(updateRoomQuery, [stringifiedRoomImageIds, room_id]);
      return res.status(200).json({ msg: "Hotel room images uploaded" });
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

exports.postOperator = async (req, res, next) => {
  try {
    const operatorImage = req.files["operator-image"];
    const name = req.body.name;
    const is_disabled = req.body.is_disabled;
    console.log("operatorImage", operatorImage, req.files, req.file);

    if (operatorImage && operatorImage.length > 0) {
      console.log("here", operatorImage[0].filename);
      const operatorImageUrl = `${baseUrl}/uploads/${operatorImage[0].filename}`;
      const insertOperatorQuery =
        "INSERT INTO operator (name, logo, is_disabled) VALUES (?, ?, ?)";

      console.log("here1");
      await queryAsync(insertOperatorQuery, [
        name,
        operatorImageUrl,
        is_disabled,
      ]);
      return res.redirect("/operators");
    } else {
      return res.status(400).json({ msg: "No operator image uploaded" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.get_hotel_rooms = async (req, res, next) => {
  try {
    const { hotel_id } = req.params; // Assuming hotel_id is passed as a route parameter
    const getRoomsQuery = `SELECT hr.*, h.*
      FROM hotel_room hr
      INNER JOIN hotel h ON hr.hotel_id = h.id`;

    const rooms = await queryAsyncWithoutValue(getRoomsQuery);
    // const rooms = await queryAsync(getRoomsQuery, [hotel_id]);

    return res.status(200).json({ status: true, rooms });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.book_hotel_room = async (req, res, next) => {
  try {
    const { user_id, hotel_id, room_id, check_in, check_out } = req.body;

    const bookingQuery = `INSERT INTO book_hotel (user_id, hotel_id, room_id, check_in, check_out, status) VALUES (?, ?, ?, ?, ?, ?)`;
    const result = await queryAsync(bookingQuery, [
      user_id,
      hotel_id,
      room_id,
      check_in,
      check_out,
      0,
    ]);
    return res.status(200).json({ status: true, msg: "Booking successful" });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_booked_hotel_rooms = async (req, res, next) => {
  try {
    // const { user_id } = req.params;

    const getRoomsQuery = `
      SELECT
          b.*,
          u.name,
          u.email,
          hr.room_name,
          hr.price_per_night,
          h.*
      FROM
          book_hotel b
      INNER JOIN
          hotel_room hr ON b.room_id = hr.id
      INNER JOIN
          hotel h ON hr.hotel_id = h.id
      INNER JOIN
          users u ON b.user_id = u.userid
    `;

    const rooms = await queryAsync(getRoomsQuery, []);
    return res.status(200).json({ status: true, rooms });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};
