const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");

exports.getSettings = async (req, res, next) => {
  try {
    console.log(req.query.mobile);
    mobile = req.query.mobile;
    const helpCenterQuery = `SELECT * FROM help_center`;
    const helpCenters = await queryAsyncWithoutValue(helpCenterQuery);

    const referQuery = `SELECT * FROM type WHERE type_name="refer"`;
    const refers = await queryAsyncWithoutValue(referQuery);

    const registrationFeeQuery = `SELECT price FROM packages WHERE package_name = 'Registration Fee'`;
    const registrationFees = await queryAsyncWithoutValue(registrationFeeQuery);

    const minVideoQuery = `SELECT min_refer FROM general`;
    const minVideo = await queryAsyncWithoutValue(minVideoQuery);

    console.log(refers);
    return res.status(200).render("pages/settings", {
      title: "Settings",
      helpCenters,
      refers,
      registrationFees,
      minVideo,
    });
  } catch (e) {
    console.log(e);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.updateHelpCenters = async (req, res, next) => {
  try {
    const { customer_service, website, youtube, facebook, instagram, id } =
      req.body;
    console.log(req.body);

    const helpCenterQueryUpdate =
      "UPDATE help_Center SET customer_service = ?, website = ?, youtube = ?, facebook = ?, instagram = ? WHERE id = ?";
    await queryAsync(helpCenterQueryUpdate, [
      customer_service,
      website,
      youtube,
      facebook,
      instagram,
      id,
    ]);

    return res.redirect("/settings");
  } catch (err) {
    console.log(err);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.updateRegistrationFee = async (req, res, next) => {
  try {
    const { prices } = req.body;
    console.log(req.body);

    const registrationFeeQueryUpdate =
      "UPDATE packages SET price = ? WHERE package_name = 'Registration Fee'";
    await queryAsync(registrationFeeQueryUpdate, [prices]);

    return res.redirect("/settings");
  } catch (err) {
    console.log(err);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.updateReferPoint = async (req, res, next) => {
  try {
    const { points, id } = req.body;
    console.log(req.body);

    const referQueryUpdate = "UPDATE type SET points = ? WHERE id = ?";
    await queryAsync(referQueryUpdate, [points, id]);

    return res.redirect("/settings");
  } catch (err) {
    console.log(err);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};

exports.updateMinVideo = async (req, res, next) => {
  try {
    const { min_refer } = req.body;
    console.log(req.body);

    const minVideoQueryUpdate = "UPDATE general SET min_refer = ?";
    await queryAsync(minVideoQueryUpdate, [min_refer]);

    return res.redirect("/settings");
  } catch (err) {
    console.log(err);
    return res.status(503).json({ msg: "Internal Server Error" });
  }
};
