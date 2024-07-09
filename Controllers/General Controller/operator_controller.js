const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");

exports.getOperator = async (req, res, next) => {
  try {
    const get_operator_query = `SELECT * from operator`;
    const operator_data = await queryAsyncWithoutValue(get_operator_query);

    if (operator_data.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No operator found",
        operator: [],
      });
    }

    return res.status(200).json({
      status: true,
      message: "",
      operator: operator_data,
    });
  } catch (e) {
    console.log(e);
    return res.status(503).json({
      status: false,
      message: "Internal Server Error",
      operator: [],
    });
  }
};
