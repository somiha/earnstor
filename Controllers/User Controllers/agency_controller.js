const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");
require("dotenv").config();
const baseUrl = process.env.baseUrl;

exports.add_agency_package = async (req, res, next) => {
  try {
    const { agency_id, package_name, price, facilities } = req.body;
    const image = req.files["image"];

    let imageUrl = null;

    if (image) {
      imageUrl = `${baseUrl}/uploads/${image[0].filename}`;
    }

    const addPackageQuery =
      "INSERT INTO agency_package (agency_id, package_name, price, facilities, image) VALUES (?, ?, ?, ?, ?)";
    await queryAsync(addPackageQuery, [
      agency_id,
      package_name,
      price,
      facilities,
      imageUrl,
    ]);

    return res.status(200).json({
      status: true,
      msg: "Agency Package added successfully",
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

exports.get_agency_package = async (req, res, next) => {
  try {
    const { agency_id } = req.params; // Assuming hotel_id is passed as a route parameter
    const getPackageQuery = `SELECT ap.*, a.*
      FROM agency_package ap
      INNER JOIN agency a ON ap.agency_id = a.id`;

    const agencies = await queryAsyncWithoutValue(getPackageQuery);
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

    const bookingQuery = `INSERT INTO book_agency (user_id, agency_id, agency_package_id, status) VALUES (?, ?, ?, ?)`;
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

exports.get_booked_agency_package = async (req, res, next) => {
  try {
    // const { user_id } = req.params;

    const getAgencyQuery = `
      SELECT
          b.*,
          u.name,
          u.email,
          ap.package_name,
          ap.price,
          a.*
      FROM
          book_agency b
      INNER JOIN
          agency_package ap ON b.agency_package_id = ap.id
      INNER JOIN
          agency a ON ap.agency_id = a.id
      INNER JOIN
          users u ON b.user_id = u.userid
    `;

    const agency = await queryAsync(getAgencyQuery, []);
    return res.status(200).json({ status: true, agency });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};
