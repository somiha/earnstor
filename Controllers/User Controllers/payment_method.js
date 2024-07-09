const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");
require("dotenv").config();
const baseUrl = process.env.baseUrl;

exports.add_payment_method = async (req, res, next) => {
  try {
    const { title, number } = req.body;
    const logo = req.files["logo"];

    let logoUrl = null;

    if (logo && logo.length > 0) {
      logoUrl = `${baseUrl}/uploads/${logo[0].filename}`;
    }

    const addPaymentMethodQuery =
      "INSERT INTO payment_method (title, logo, number) VALUES (?, ?, ?)";
    await queryAsync(addPaymentMethodQuery, [title, logoUrl, number]);

    return res.status(200).json({
      status: true,
      msg: "Payment method added successfully",
      paymentMethod: { title, logo: logoUrl, number },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_payment_method = async (req, res, next) => {
  try {
    const getPaymentMethodsQuery = `SELECT * FROM payment_method`;
    const paymentMethods = await queryAsyncWithoutValue(getPaymentMethodsQuery);

    return res.status(200).json({ status: true, paymentMethods });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};
