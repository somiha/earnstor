const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");
require("dotenv").config();
const baseUrl = process.env.baseUrl;

exports.add_hajj_agency_package = async (req, res, next) => {
  try {
    const { agency_id, package_name, price, facilities } = req.body;
    const image = req.files["image"];

    let imageUrl = null;

    if (image) {
      imageUrl = `${baseUrl}/uploads/${image[0].filename}`;
    }

    const addPackageQuery =
      "INSERT INTO hajj_agency_package (agency_id, package_name, price, facilities, image) VALUES (?, ?, ?, ?, ?)";
    await queryAsync(addPackageQuery, [
      agency_id,
      package_name,
      price,
      facilities,
      imageUrl,
    ]);

    return res.status(200).json({
      status: true,
      msg: "Hajj Agency Package added successfully",
      AgencyPackage: {
        agency_id,
        package_name,
        price,
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

exports.get_hajj_agency_package = async (req, res, next) => {
  try {
    const { agency_id } = req.query;
    const getPackageQuery = `SELECT ap.*, a.*
      FROM hajj_agency_package ap
      INNER JOIN hajj_agency a ON ap.agency_id = a.id WHERE agency_id = ?`;

    const agencies = await queryAsync(getPackageQuery, [agency_id]);
    // const rooms = await queryAsync(getRoomsQuery, [hotel_id]);

    return res.status(200).json({ status: true, agencies });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.book_agency = async (req, res, next) => {
  try {
    const { user_id, agency_id, agency_package_id } = req.body;

    const bookingQuery = `INSERT INTO hajj_book_agency (user_id, agency_id, agency_package_id, status) VALUES (?, ?, ?, ?)`;
    const result = await queryAsync(bookingQuery, [
      user_id,
      agency_id,
      agency_package_id,
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

exports.get_booked_hajj_agency_package = async (req, res, next) => {
  try {
    const { user_id } = req.query;

    const getAgencyQuery = `
      SELECT
          b.*,
          u.name,
          u.email,
          ap.package_name,
          ap.price,
          a.*
      FROM
          hajj_book_agency b
      INNER JOIN
          hajj_agency_package ap ON b.agency_package_id = ap.id
      INNER JOIN
          hajj_agency a ON ap.agency_id = a.id
      INNER JOIN
          users u ON b.user_id = u.userid WHERE user_id = ?
    `;

    const agency = await queryAsync(getAgencyQuery, [user_id]);
    return res.status(200).json({ status: true, agency });
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
      "INSERT INTO hajj_agency (agency_name, location, longitude, latitude, mobile_number, email, image) VALUES (?, ?, ?, ?, ?, ?, ?)";
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
      msg: "Hajj Agency added successfully",
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
    const getAgencysQuery = `SELECT * FROM hajj_agency`;
    const Agencys = await queryAsyncWithoutValue(getAgencysQuery);

    return res.status(200).json({ status: true, Agencys });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};
