const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");

exports.addPointType = async (req, res, next) => {
  try {
    let type_name = req.body.type_name;
    let points = req.body.points;
    const addPointTypeQuery = `INSERT INTO type (type_name, points) VALUES (?, ?)`;
    await queryAsync(addPointTypeQuery, [type_name, points]);
    return res.status(200).json({
      msg: "Point type added successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.getPointTypes = async (req, res, next) => {
  try {
    const getPointTypesQuery = `SELECT * FROM type`;
    const pointTypes = await queryAsyncWithoutValue(getPointTypesQuery);

    return res.status(200).json({ pointTypes });
  } catch (err) {
    console.log(err);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};
