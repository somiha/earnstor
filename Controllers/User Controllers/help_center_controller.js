const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");

exports.add_help_center = async (req, res, next) => {
  try {
    let customer_service = req.body.customer_service;
    let youtube = req.body.youtube;
    let website = req.body.website;
    let facebook = req.body.facebook;
    let instagram = req.body.instagram;
    let share_link = req.body.share_link;
    const addHelpCenterQuery = `INSERT INTO help_center(customer_service, website, youtube, facebook, instagram, share_link) VALUES (?, ?, ?, ?, ?, ?)`;
    await queryAsync(addHelpCenterQuery, [
      customer_service,
      website,
      youtube,
      facebook,
      instagram,
      share_link,
    ]);
    const getHelpCenterQuery = `SELECT * FROM help_center`;
    const helpCenter = await queryAsyncWithoutValue(getHelpCenterQuery);
    return res.status(200).json({
      msg: "Help center added successfully",
      helpCenter,
    });
  } catch (err) {
    console.log(err);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.get_help_center = async (req, res, next) => {
  try {
    const getHelpCenterQuery = `SELECT * FROM help_center`;
    const helpCenter = await queryAsyncWithoutValue(getHelpCenterQuery);

    return res.status(200).json({ helpCenter });
  } catch (err) {
    console.log(err);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};
