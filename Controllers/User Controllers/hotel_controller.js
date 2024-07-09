const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");
require("dotenv").config();
const baseUrl = process.env.baseUrl;

exports.add_hotel = async (req, res, next) => {
  try {
    const {
      id,
      hotel_name,
      location,
      longitude,
      latitude,
      rating,
      reviews,
      mobile_number,
      email,
      checking_in,
      checking_out,
    } = req.body;
    const images = req.files["images"];

    let imageUrls = [];

    if (images && images.length > 0) {
      imageUrls = images.map((image) => `${baseUrl}/uploads/${image.filename}`);
    }

    const addHotelQuery =
      "INSERT INTO hotel (id, hotel_name, location, longitude, latitude, rating, reviews, mobile_number, email, checking_in, checking_out, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    await queryAsync(addHotelQuery, [
      id,
      hotel_name,
      location,
      longitude,
      latitude,
      rating,
      reviews,
      mobile_number,
      email,
      checking_in,
      checking_out,
      imageUrls.join(";"), // Store multiple image URLs as a string in the database
    ]);

    return res.status(200).json({
      status: true,
      msg: "Hotel added successfully",
      Hotel: {
        id,
        hotel_name,
        location,
        longitude,
        latitude,
        rating,
        reviews,
        mobile_number,
        email,
        checking_in,
        checking_out,
        images: imageUrls,
      },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_hotel = async (req, res, next) => {
  try {
    const getHotelQuery = `SELECT * FROM hotel`;
    const Pdfs = await queryAsyncWithoutValue(getHotelQuery);

    return res.status(200).json({ status: true, Pdfs });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_hotel_by_id = async (req, res, next) => {
  try {
    const { id } = req.params;
    const getHotelQuery = `SELECT * FROM hotel WHERE id = ?`;
    const hotel = await queryAsync(getHotelQuery, [id]);
    const hotelRoomsQuery = `SELECT * FROM hotel_room WHERE hotel_id = ?`;
    let hotelRooms = await queryAsync(hotelRoomsQuery, [id]);

    hotelRooms = await Promise.all(
      hotelRooms.map(async (room) => {
        const roomImagesIds = room.images ? JSON.parse(room.images) : [];
        let promises = [];

        if (roomImagesIds.length > 0) {
          promises = roomImagesIds.map(async (imageId) => {
            const imageUrl = `SELECT url FROM images WHERE id = ?`;
            const result = await queryAsync(imageUrl, [imageId]);
            console.log(result[0].url);
            return result[0].url;
          });
        }

        // console.log(roomImages);
        const roomImages = await Promise.all(promises);

        return {
          ...room,
          image: room.image,
          images: roomImages,
        };
      })
    );

    return res.status(200).json({ status: true, hotel, hotelRooms });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_hotel_room_by_id = async (req, res, next) => {
  try {
    const { id } = req.params;
    const getHotelRoomQuery = `SELECT * FROM hotel_room WHERE id = ?`;
    const hotelRoom = await queryAsync(getHotelRoomQuery, [id]);

    const roomImagesIds = hotelRoom[0].images
      ? JSON.parse(hotelRoom[0].images)
      : [];
    let promises = [];

    console.log("roomImagesIds", roomImagesIds);

    promises = roomImagesIds.map(async (imageId) => {
      const imageUrl = `SELECT url FROM images WHERE id = ?`;
      const result = await queryAsync(imageUrl, [imageId]);
      return result[0].url;
    });

    const roomImages = await Promise.all(promises);
    const data = {
      ...hotelRoom[0],
      images: roomImages,
    };

    return res.status(200).json({ status: true, data });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.add_agency = async (req, res, next) => {
  try {
    const { agency_name, location, longitude, latitude, mobile_number, email } =
      req.body;
    let image = req.files["image"];
    console.log("image", req.files);

    let imageUrl = null;
    if (image) {
      imageUrl = `${baseUrl}/uploads/${image[0].filename}`;
    }

    const addHotelQuery =
      "INSERT INTO agency (agency_name, location, longitude, latitude, mobile_number, email, image) VALUES (?, ?, ?, ?, ?, ?, ?)";
    await queryAsync(addHotelQuery, [
      agency_name,
      location,
      longitude,
      latitude,
      mobile_number,
      email,
      imageUrl,
    ]);

    return res.status(200).json({
      status: true,
      msg: "Hotel added successfully",
      Agency: {
        agency_name,
        location,
        longitude,
        latitude,
        mobile_number,
        email,
        imageUrl,
      },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_agencys = async (req, res, next) => {
  try {
    const getAgencysQuery = `SELECT * FROM agency`;
    const Agencys = await queryAsyncWithoutValue(getAgencysQuery);

    return res.status(200).json({ status: true, Agencys });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};
