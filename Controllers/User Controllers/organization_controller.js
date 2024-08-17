const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");
require("dotenv").config();
const baseUrl = process.env.baseUrl;

exports.addOrganization = async (req, res, next) => {
  try {
    const { name } = req.body;
    const image = req.files["image"];

    let imageUrl = null;

    if (image) {
      imageUrl = `${baseUrl}/uploads/${image[0].filename}`;
    }

    const addOrganizationQuery =
      "INSERT INTO organization (name, image) VALUES (?, ?)";
    await queryAsync(addOrganizationQuery, [name, imageUrl]);

    return res.status(200).json({
      status: true,
      msg: "Organization added successfully",
      organization: {
        name,
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

exports.getOrganizations = async (req, res, next) => {
  try {
    const getOrganizationsQuery = "SELECT * FROM organization";
    const organizations = await queryAsync(getOrganizationsQuery);

    return res.status(200).json({
      status: true,
      organizations,
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.addProjects = async (req, res, next) => {
  try {
    const { org_id, name } = req.body;
    const image = req.files["image"];

    let imageUrl = null;

    if (image) {
      imageUrl = `${baseUrl}/uploads/${image[0].filename}`;
    }

    const addProjectsQuery =
      "INSERT INTO projects (org_id, name, image) VALUES (?, ?)";
    await queryAsync(addProjectsQuery, [org_id, name, imageUrl]);

    return res.status(200).json({
      status: true,
      msg: "Project added successfully",
      project: {
        org_id,
        name,
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

exports.getProjectsByOrgId = async (req, res, next) => {
  try {
    const { org_id } = req.query;
    const getProjectsQuery = "SELECT * FROM projects WHERE org_id = ?";
    const projects = await queryAsync(getProjectsQuery, [org_id]);

    return res.status(200).json({
      status: true,
      projects,
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.addDonate = async (req, res, next) => {
  try {
    const { project_id, description } = req.body;
    const image = req.files["image"];

    let imageUrl = null;

    if (image) {
      imageUrl = `${baseUrl}/uploads/${image[0].filename}`;
    }

    const addDonateQuery =
      "INSERT INTO donate (project_id, image, description) VALUES (?, ?, ?)";
    await queryAsync(addDonateQuery, [project_id, imageUrl, description]);

    return res.status(200).json({
      status: true,
      msg: "Donate entry added successfully",
      donate: {
        project_id,
        image: imageUrl,
        description,
      },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.getDonateByProjectId = async (req, res, next) => {
  try {
    const { project_id } = req.query;
    const getDonateQuery = "SELECT * FROM donate WHERE project_id = ?";
    const donations = await queryAsync(getDonateQuery, [project_id]);

    return res.status(200).json({
      status: true,
      donations,
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.addOrgDonation = async (req, res, next) => {
  try {
    const {
      mobile_number,
      transaction_id,
      operator,
      amount,
      user_id,
      donate_id,
      message,
    } = req.body;

    const addOrgDonationQuery = `
      INSERT INTO org_donation (
        mobile_number, transaction_id, operator, amount, user_id, payment_status, donate_id, message, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;

    await queryAsync(addOrgDonationQuery, [
      mobile_number,
      transaction_id,
      operator,
      amount,
      user_id,
      "Pending",
      donate_id,
      message,
    ]);

    return res.status(200).json({
      status: true,
      msg: "Organization donation added successfully",
      org_donation: {
        mobile_number,
        transaction_id,
        operator,
        amount,
        user_id,
        payment_status: "Pending",
        donate_id,
        message,
      },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.getOrgDonationByUserId = async (req, res, next) => {
  try {
    const { user_id } = req.query;

    const getOrgDonationQuery = `
      SELECT * FROM org_donation WHERE user_id = ? ORDER BY created_at DESC`;

    const donations = await queryAsync(getOrgDonationQuery, [user_id]);

    return res.status(200).json({
      status: true,
      donations,
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};
