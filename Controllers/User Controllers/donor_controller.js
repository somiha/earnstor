const { log } = require("console");
const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");
require("dotenv").config();
const baseUrl = process.env.baseUrl;
const fs = require("fs");
const path = require("path");

exports.add_donor = async (req, res, next) => {
  try {
    const {
      name,
      mobile_number,
      upazila_id,
      district_id,
      division_id,
      address,
      gender,
      age,
      blood_group_id,
      last_donation_date,
    } = req.body;
    const image = req.files["image"];

    let imageUrl = null;

    if (image) {
      imageUrl = `${baseUrl}/uploads/${image[0].filename}`;
    }

    const addQuery =
      "INSERT INTO donor (name, mobile_number, upazila_id, district_id, division_id, address, image, gender, age, blood_group_id, last_donation_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    await queryAsync(addQuery, [
      name,
      mobile_number,
      upazila_id,
      district_id,
      division_id,
      address,
      imageUrl,
      gender,
      age,
      blood_group_id,
      last_donation_date,
    ]);

    return res.status(200).json({
      status: true,
      msg: "Blood Group added successfully",
      BloodGroup: {
        name,
        mobile_number,
        upazila_id,
        district_id,
        division_id,
        address,
        image: imageUrl,
        gender,
        age,
        blood_group_id,
        last_donation_date,
      },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_donor = async (req, res, next) => {
  try {
    const getDonorQuery = `
      SELECT d.*, 
             u.id AS upazila_id, u.name AS upazila_name,
             di.id AS district_id, di.name AS district_name,
             dv.id AS division_id, dv.name AS division_name,
             bg.id AS blood_group_id, bg.blood_group AS blood_group_name
      FROM donor d
      INNER JOIN upazila u ON d.upazila_id = u.id
      INNER JOIN district di ON d.district_id = di.id
      INNER JOIN division dv ON d.division_id = dv.id
      INNER JOIN blood_group bg ON d.blood_group_id = bg.id
    `;

    const donors = await queryAsyncWithoutValue(getDonorQuery);

    return res.status(200).json({ status: true, donors });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.edit_donor = async (req, res, next) => {
  try {
    const { donor_id } = req.params;
    const { name, blood_group_id, gender, age, mobile_number } = req.body;
    const image = req.files["image"];

    const fetchQuery = `
      SELECT * FROM donor WHERE id = ?
    `;
    const existingDonor = await queryAsync(fetchQuery, [donor_id]);

    // Determine imageUrl based on existing image presence
    // let imageUrl = null;
    if (existingDonor && existingDonor[0] && existingDonor[0].image) {
      imageUrl = `${baseUrl}/uploads/${existingDonor[0].image}`;
    }

    // Handle image update
    if (image && image[0]) {
      // Upload new image
      imageUrl = `${baseUrl}/uploads/${image[0].filename}`;

      // Delete existing image if it exists
      if (existingDonor && existingDonor[0] && existingDonor[0].image) {
        const imagePath = path.join(
          __dirname,
          "..",
          "uploads",
          existingDonor[0].image
        );

        // Delete existing image file
        fs.unlinkSync(imagePath);
      }

      // Update image URL in the database
      const updateImageQuery = `
        UPDATE donor
        SET image = ?
        WHERE id = ?
      `;
      await queryAsync(updateImageQuery, [imageUrl, donor_id]);
    }

    // Update textual information
    const updateQuery = `
      UPDATE donor 
      SET name = ?, blood_group_id = ?, gender = ?, age = ?, mobile_number = ?
      WHERE id = ?
    `;
    await queryAsync(updateQuery, [
      name,
      blood_group_id,
      gender,
      age,
      mobile_number,
      donor_id,
    ]);

    return res.status(200).json({
      status: true,
      msg: "Donor information updated successfully",
      donor: {
        name,
        blood_group_id,
        gender,
        age,
        mobile_number,
        image: imageUrl,
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

exports.get_donor_blood_group = async (req, res, next) => {
  try {
    const { blood_group_id } = req.query;
    const getDonorQuery = `
       SELECT d.name, d.mobile_number,
             bg.id AS blood_group_id, bg.blood_group AS blood_group_name
      FROM donor d
      INNER JOIN blood_group bg ON d.blood_group_id = bg.id 
      WHERE d.blood_group_id = ?
    `;

    const donors = await queryAsync(getDonorQuery, [blood_group_id]);

    console.log("Donors:", donors);

    return res.status(200).json({ status: true, donors });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};
