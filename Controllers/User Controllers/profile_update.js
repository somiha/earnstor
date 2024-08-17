const db = require("../../Utils/db_connection");
const { queryAsync, queryAsyncWithoutValue } = require("../../Utils/helper");
const baseUrl = process.env.baseUrl;

exports.profile_update = async (req, res) => {
  const { id } = req.query;
  const { title, studied_at, working_at, address, relationship, country } =
    req.body;

  const updateQuery =
    "UPDATE users SET title = ?, studied_at = ?, working_at = ?, address = ?, relationship = ?, country = ? WHERE userid = ?";
  await queryAsync(updateQuery, [
    title,
    studied_at,
    working_at,
    address,
    relationship,
    country,

    id,
  ]);

  //show user without password

  const selectQuery = "SELECT * FROM users WHERE userid = ?";
  const user = await queryAsync(selectQuery, [id]);

  if (!user[0]) {
    return res.status(400).json({ msg: "No user found with this id" });
  }

  return res.status(200).json({
    msg: "Profile updated successfully",
    user: user[0],
  });
};
