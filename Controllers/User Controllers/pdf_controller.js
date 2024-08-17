const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");
require("dotenv").config();
const baseUrl = process.env.baseUrl;

exports.pdf = async (req, res, next) => {
  try {
    const { title, price, description } = req.body;
    const image = req.files["image"];

    let imageUrl = null;

    if (image && image.length > 0) {
      imageUrl = `${baseUrl}/uploads/${image[0].filename}`;
    }

    const addPdfQuery =
      "INSERT INTO pdf_info (title, price, description, image) VALUES (?, ?, ?, ?)";
    await queryAsync(addPdfQuery, [title, price, description, imageUrl]);

    return res.status(200).json({
      status: true,
      msg: "Online course added successfully",
      Pdf: { title, price, description, image: imageUrl },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_pdf = async (req, res, next) => {
  try {
    const getPdfsQuery = `SELECT * FROM pdf_info`;
    const Pdfs = await queryAsyncWithoutValue(getPdfsQuery);

    return res.status(200).json({ status: true, Pdfs });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_pdf_id = async (req, res, next) => {
  try {
    const { pdf_id } = req.query;
    const getPdfsQuery = `SELECT * FROM pdf_info WHERE id = ?`;
    const Pdfs = await queryAsync(getPdfsQuery, [pdf_id]);

    return res.status(200).json({ status: true, Pdfs });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.buy_pdf = async (req, res, next) => {
  try {
    const { user_id, pdf_id, payment_id, status } = req.body;

    const addonlineCourseQuery =
      "INSERT INTO buy_option (user_id, pdf_id, payment_id, status) VALUES (?, ?, ?, ?)";
    await queryAsync(addonlineCourseQuery, [
      user_id,
      pdf_id,
      payment_id,
      "Pending",
    ]);

    return res.status(200).json({
      status: true,
      msg: "Pdf Bought successfully",
      Pdf: { user_id, pdf_id, payment_id, status: "Pending" },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_buy_pdf = async (req, res, next) => {
  try {
    const { user_id, pdf_id } = req.query;
    const getonlineCoursesQuery = `SELECT * FROM buy_option WHERE user_id = ? AND pdf_id = ?`;
    const pdf = await queryAsync(getonlineCoursesQuery, [user_id, pdf_id]);

    return res.status(200).json({ status: true, pdf });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};
