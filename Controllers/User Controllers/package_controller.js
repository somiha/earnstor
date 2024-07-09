const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");

exports.addPackage = async (req, res, next) => {
  try {
    let package_name = req.body.package_name;
    let fee = req.body.price;
    const addPackageTypeQuery = `INSERT INTO packages (package_name, price) VALUES (?, ?)`;
    await queryAsync(addPackageTypeQuery, [package_name, price]);
    return res.status(200).json({
      msg: "Package added successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};
exports.getRegistrationFees = async (req, res, next) => {
  try {
    const getRegistrationFeeQuery = `SELECT price FROM packages WHERE package_name = 'Registration Fee'`;
    const registrationFee = await queryAsyncWithoutValue(
      getRegistrationFeeQuery
    );

    return res.status(200).json({ registrationFee });
  } catch (err) {
    console.log(err);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};
