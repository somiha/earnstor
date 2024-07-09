const { log } = require("console");
const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");

const moment = require("moment");

exports.add_donation_by_user = async (req, res, next) => {
  try {
    const { donor_id, place, reason, donation_date } = req.body;

    const getLastDonationDateQuery =
      "SELECT last_donation_date FROM donor WHERE id = ?";
    const result = await queryAsync(getLastDonationDateQuery, [donor_id]);

    if (result.length === 0) {
      return res.status(404).json({ status: false, msg: "Donor not found" });
    }

    const lastDonationDate = moment(result[0].last_donation_date);
    const currentDonationDate = moment(donation_date);

    const minDonationDate = moment(currentDonationDate).subtract(3, "months");

    if (lastDonationDate.isAfter(minDonationDate)) {
      return res.status(400).json({
        status: false,
        msg: "Cannot add donation. Last donation date should be at least 3 months before the donation date.",
      });
    }

    const addQuery =
      "INSERT INTO donation (donor_id, place, reason, status, donation_date) VALUES (?, ?, ?, ?, ?)";
    await queryAsync(addQuery, [
      donor_id,
      place,
      reason,
      "pending",
      donation_date,
    ]);

    const updateDonorQuery =
      "UPDATE donor SET last_donation_date = ? WHERE id = ?";
    await queryAsync(updateDonorQuery, [donation_date, donor_id]);

    return res.status(200).json({
      status: true,
      msg: "Donation request added successfully",
      Donation: {
        donor_id,
        place,
        reason,
        status: "pending",
        donation_date,
      },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.add_donation_by_admin = async (req, res, next) => {
  try {
    const { donor_id, place, reason, donation_date } = req.body;

    const getLastDonationDateQuery =
      "SELECT last_donation_date FROM donor WHERE id = ?";
    const result = await queryAsync(getLastDonationDateQuery, [donor_id]);

    if (result.length === 0) {
      return res.status(404).json({ status: false, msg: "Donor not found" });
    }

    const lastDonationDate = moment(result[0].last_donation_date);
    const currentDonationDate = moment(donation_date);

    const minDonationDate = moment(currentDonationDate).subtract(3, "months");

    if (lastDonationDate.isAfter(minDonationDate)) {
      return res.status(400).json({
        status: false,
        msg: "Cannot add donation. Last donation date should be at least 3 months before the donation date.",
      });
    }

    const addQuery =
      "INSERT INTO donation (donor_id, place, reason, status, donation_date) VALUES (?, ?, ?, ?, ?)";
    await queryAsync(addQuery, [
      donor_id,
      place,
      reason,
      "approved",
      donation_date,
    ]);

    const updateDonorQuery =
      "UPDATE donor SET last_donation_date = ? WHERE id = ?";
    await queryAsync(updateDonorQuery, [donation_date, donor_id]);

    return res.status(200).json({
      status: true,
      msg: "Donation request added successfully",
      Donation: {
        donor_id,
        place,
        reason,
        status: "approved",
        donation_date,
      },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_recent_donations = async (req, res, next) => {
  try {
    const getDonationsQuery = `
      SELECT d.*, 
             dn.name AS donor_name,
             dn.mobile_number AS donor_mobile_number,
             dn.blood_group_id AS donor_blood_group_id,
             bg.blood_group AS donor_blood_group_name
      FROM donation d
      INNER JOIN donor dn ON d.donor_id = dn.id
      INNER JOIN blood_group bg ON dn.blood_group_id = bg.id
      ORDER BY d.created_at DESC
    `;

    const donations = await queryAsyncWithoutValue(getDonationsQuery);

    return res.status(200).json({ status: true, donations });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};
