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
