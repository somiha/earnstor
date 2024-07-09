const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");

exports.getBanner = async (req, res, next) => {
  try {
    const get_banner_query = `SELECT * from banner`;
    const banners_data = await queryAsyncWithoutValue(get_banner_query);

    if (banners_data.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No banner found",
        banner: [],
      });
    }

    return res.status(200).json({
      status: true,
      message: "",
      banner: banners_data,
    });
  } catch (e) {
    console.log(e);
    return res.status(503).json({
      status: false,
      message: "Internal Server Error",
      banner: [],
    });
  }
};
