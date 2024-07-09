const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");
require("dotenv").config();
const baseUrl = process.env.baseUrl;

exports.country = async (req, res, next) => {
  try {
    const { name } = req.body;

    const addCountryQuery = "INSERT INTO country (name) VALUES (?)";
    await queryAsync(addCountryQuery, [name]);

    return res.status(200).json({
      status: true,
      msg: "Country added successfully",
      Country: { name },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

exports.get_country = async (req, res, next) => {
  try {
    const getCountrysQuery = `SELECT * FROM country`;
    const Countrys = await queryAsyncWithoutValue(getCountrysQuery);

    return res.status(200).json({ status: true, Countrys });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};
