const { log } = require("console");
const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");
require("dotenv").config();
const baseUrl = process.env.baseUrl;
const fs = require("fs");
const path = require("path");

// exports.add_donor = async (req, res, next) => {
//   try {
//     const {
//       name,
//       mobile_number,
//       upazila_id,
//       district_id,
//       division_id,
//       address,
//       gender,
//       age,
//       blood_group_id,
//       last_donation_date,
//       user_id
//     } = req.body;
//     const image = req.files["image"];

//     let imageUrl = null;

//     if (image) {
//       imageUrl = `${baseUrl}/uploads/${image[0].filename}`;
//     }

//     const addQuery =
//       "INSERT INTO donor (name, mobile_number, upazila_id, district_id, division_id, address, image, gender, age, blood_group_id, last_donation_date, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
//     await queryAsync(addQuery, [
//       name,
//       mobile_number,
//       upazila_id,
//       district_id,
//       division_id,
//       address,
//       imageUrl,
//       gender,
//       age,
//       blood_group_id,
//       last_donation_date,
//       user_id,
//     ]);

//     return res.status(200).json({
//       status: true,
//       msg: "Blood Group added successfully",
//       BloodGroup: {
//         name,
//         mobile_number,
//         upazila_id,
//         district_id,
//         division_id,
//         address,
//         image: imageUrl,
//         gender,
//         age,
//         blood_group_id,
//         last_donation_date,
//         user_id,
//       },
//     });
//   } catch (e) {
//     console.error(e);
//     return res
//       .status(500)
//       .json({ status: false, msg: "Internal Server Error" });
//   }
// };

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
      user_id,
    } = req.body;
    const image =
      req.files && req.files["image"] ? req.files["image"][0] : null;

    let imageUrl = null;

    if (image) {
      imageUrl = `${baseUrl}/uploads/${image.filename}`;
    }

    // Check if the user already has a donor entry
    if (user_id) {
      const checkDonorQuery = "SELECT * FROM donor WHERE user_id = ?";
      const existingDonor = await queryAsync(checkDonorQuery, [user_id]);

      if (existingDonor.length > 0) {
        return res.status(400).json({
          status: false,
          msg: "This user is already registered as a donor.",
        });
      }
    }

    // Insert into the donor table
    const addQuery =
      "INSERT INTO donor (name, mobile_number, upazila_id, district_id, division_id, address, image, gender, age, blood_group_id, last_donation_date, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
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
      user_id,
    ]);

    // Update is_donor field in the user table if user_id is provided
    if (user_id) {
      const updateUserQuery = "UPDATE users SET is_donor = 1 WHERE userid = ?";
      await queryAsync(updateUserQuery, [user_id]);
    }

    return res.status(200).json({
      status: true,
      msg: "Donor added successfully",
      donor: {
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
        user_id,
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

exports.get_donor_by_id = async (req, res, next) => {
  try {
    const { donor_id } = req.query;

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
      INNER JOIN blood_group bg ON d.blood_group_id = bg.id WHERE d.id = ?
    `;

    const donors = await queryAsync(getDonorQuery, [donor_id]);

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
    const { donor_id } = req.query;
    const { name, blood_group_id, gender, age, mobile_number } = req.body;
    const image =
      req.files && req.files["image"] ? req.files["image"][0] : null;

    // Fetch the existing donor record
    const fetchQuery = `SELECT * FROM donor WHERE id = ?`;
    const existingDonor = await queryAsync(fetchQuery, [donor_id]);

    if (!existingDonor || !existingDonor[0]) {
      return res.status(404).json({
        status: false,
        msg: "Donor not found",
      });
    }

    let imageUrl = existingDonor[0].image;

    // Handle image update if provided
    if (image) {
      imageUrl = `${baseUrl}/uploads/${image.filename}`;

      // Delete existing image if it exists
      if (existingDonor[0].image) {
        const imagePath = path.join(
          __dirname,
          "..",
          "uploads",
          existingDonor[0].image
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      // Update the image field in the database
      const updateImageQuery = `UPDATE donor SET image = ? WHERE id = ?`;
      await queryAsync(updateImageQuery, [image.filename, donor_id]);
    }

    // Build the dynamic update query
    let updateFields = [];
    let updateValues = [];

    if (name) {
      updateFields.push("name = ?");
      updateValues.push(name);
    }
    if (blood_group_id) {
      updateFields.push("blood_group_id = ?");
      updateValues.push(blood_group_id);
    }
    if (gender) {
      updateFields.push("gender = ?");
      updateValues.push(gender);
    }
    if (age) {
      updateFields.push("age = ?");
      updateValues.push(age);
    }
    if (mobile_number) {
      updateFields.push("mobile_number = ?");
      updateValues.push(mobile_number);
    }

    // Only run the update if there are fields to update
    if (updateFields.length > 0) {
      const updateQuery = `UPDATE donor SET ${updateFields.join(
        ", "
      )} WHERE id = ?`;
      updateValues.push(donor_id);
      await queryAsync(updateQuery, updateValues);
    }

    return res.status(200).json({
      status: true,
      msg: "Donor information updated successfully",
      donor: {
        name: name || existingDonor[0].name,
        blood_group_id: blood_group_id || existingDonor[0].blood_group_id,
        gender: gender || existingDonor[0].gender,
        age: age || existingDonor[0].age,
        mobile_number: mobile_number || existingDonor[0].mobile_number,
        image: imageUrl ? `${baseUrl}/uploads/${imageUrl}` : null,
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
       SELECT d.name, d.mobile_number, d.image,
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
