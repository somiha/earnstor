const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");
require("dotenv").config();
const baseUrl = process.env.baseUrl;

exports.add_hotel = async (req, res, next) => {
  try {
    const {
      hotel_name,
      location,
      longitude,
      latitude,
      mobile_number,
      email,
      checking_in,
      checking_out,
    } = req.body;
    const image = req.files["image"];

    let imageUrl = null;

    if (image) {
      imageUrl = `${baseUrl}/uploads/${image[0].filename}`;
    }

    const addHotelQuery =
      "INSERT INTO hotel ( hotel_name, location, longitude, latitude, mobile_number, email, checking_in, checking_out, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    await queryAsync(addHotelQuery, [
      hotel_name,
      location,
      longitude,
      latitude,
      mobile_number,
      email,
      checking_in,
      checking_out,
      imageUrl, // Store multiple image URLs as a string in the database
    ]);

    return res.status(200).json({
      status: true,
      msg: "Hotel added successfully",
      Hotel: {
        hotel_name,
        location,
        longitude,
        latitude,
        mobile_number,
        email,
        checking_in,
        checking_out,
        images: imageUrl,
      },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.add_review = async (req, res, next) => {
  try {
    const { review, rating, user_id, hotel_id } = req.body;

    // Insert the new review into the reviews table
    const addReviewQuery = `
      INSERT INTO review (review, rating, user_id, hotel_id) 
      VALUES (?, ?, ?, ?)
    `;
    await queryAsync(addReviewQuery, [review, rating, user_id, hotel_id]);

    // Calculate the new average rating for the hotel and round to 2 decimal places
    const avgRatingQuery = `
      SELECT ROUND(AVG(rating), 2) as avgRating 
      FROM review 
      WHERE hotel_id = ?
    `;
    const avgRatingResult = await queryAsync(avgRatingQuery, [hotel_id]);
    const avgRating = avgRatingResult[0].avgRating;

    // Update the hotel table with the new average rating
    const updateHotelRatingQuery = `
      UPDATE hotel 
      SET rating = ? 
      WHERE id = ?
    `;
    await queryAsync(updateHotelRatingQuery, [avgRating, hotel_id]);

    return res.status(200).json({
      status: true,
      msg: "Review added successfully",
      Review: {
        review,
        rating,
        user_id,
        hotel_id,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};

exports.get_hotel = async (req, res, next) => {
  try {
    const getHotelQuery = `
      SELECT h.*, 
             r.review, 
             r.rating AS review_rating, 
             r.user_id AS review_user_id, 
             r.hotel_id AS review_hotel_id
      FROM hotel h
      LEFT JOIN review r ON h.id = r.hotel_id
    `;
    const hotelResult = await queryAsyncWithoutValue(getHotelQuery);

    // Group reviews by hotel
    const hotels = hotelResult.reduce((acc, curr) => {
      const hotel = acc.find((h) => h.id === curr.id);
      if (hotel) {
        hotel.reviews.push({
          review: curr.review,
          rating: curr.review_rating,
          user_id: curr.review_user_id,
          hotel_id: curr.review_hotel_id,
        });
      } else {
        acc.push({
          ...curr,
          reviews: curr.review
            ? [
                {
                  review: curr.review,
                  rating: curr.review_rating,
                  user_id: curr.review_user_id,
                  hotel_id: curr.review_hotel_id,
                },
              ]
            : [],
        });
      }
      return acc;
    }, []);

    return res.status(200).json({ status: true, hotels });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_hotel_by_id = async (req, res, next) => {
  try {
    const { id } = req.query;
    const getHotelQuery = `SELECT * FROM hotel WHERE id = ?`;
    const hotel = await queryAsync(getHotelQuery, [id]);

    if (hotel.length === 0) {
      return res.status(404).json({ status: false, msg: "Hotel not found" });
    }

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
            return result[0].url;
          });
        }

        const roomImages = await Promise.all(promises);

        return {
          ...room,
          images: roomImages,
        };
      })
    );

    const reviewsQuery = `SELECT * FROM review WHERE hotel_id = ?`;
    const reviews = await queryAsync(reviewsQuery, [id]);

    return res.status(200).json({
      status: true,
      hotel: hotel[0],
      hotelRooms,
      reviews,
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_hotel_room_by_id = async (req, res, next) => {
  try {
    const { id } = req.query;
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
